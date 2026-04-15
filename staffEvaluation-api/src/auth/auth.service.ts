import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Prisma, User, Profile, UserRole } from '@prisma/client';

type UserWithRelations = User & {
  profile: Profile | null;
  roles: UserRole[];
};

@Injectable()
export class AuthService {
  private readonly refreshTokenSecret: string;

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    const jwtSecret = this.configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new Error('JWT_SECRET environment variable is not set');
    }
    const refreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET');
    if (!refreshSecret) {
      Logger.warn('JWT_REFRESH_SECRET not set — deriving from JWT_SECRET. Set it explicitly in production.', 'AuthService');
    }
    this.refreshTokenSecret = refreshSecret || jwtSecret + '-refresh';
  }

  /**
   * Link the user's profile to a Staff row when email matches exactly one
   * Staff.schoolEmail and that staff is not already linked. Mirrors the
   * OAuth auto-link path so both flows behave the same.
   */
  private async autoLinkStaff(user: UserWithRelations): Promise<UserWithRelations> {
    if (user.profile?.staffId) return user;

    const matches = await this.prisma.staff.findMany({
      where: { schoolEmail: user.email },
      include: { profile: true },
      take: 2,
    });
    const staff = matches.length === 1 ? matches[0] : null;
    if (!staff || staff.profile) return user;

    try {
      await this.prisma.profile.update({
        where: { userId: user.id },
        data: { staffId: staff.id },
      });
    } catch (error) {
      // Another concurrent login may have claimed the staff link first.
      // Unique violation on profile.staffId → just return the user; they'll
      // fetch the current state on next request.
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        return user;
      }
      throw error;
    }

    return this.prisma.user.findUniqueOrThrow({
      where: { id: user.id },
      include: { profile: true, roles: true },
    });
  }

  async register(dto: RegisterDto) {
    const exists = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (exists) {
      if (!exists.passwordHash) {
        throw new ConflictException(
          'This email is registered via Microsoft. Please use the "Sign in with HUST account" button.',
        );
      }
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        profile: {
          create: {},
        },
        roles: {
          create: { role: 'user' },
        },
      },
      include: {
        profile: true,
        roles: true,
      },
    });

    const linked = await this.autoLinkStaff(user);
    return this.generateTokenResponse(linked);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: {
        profile: true,
        roles: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.passwordHash) {
      throw new UnauthorizedException(
        'This account uses Microsoft sign-in. Please use the "Sign in with HUST account" button.',
      );
    }

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const linked = await this.autoLinkStaff(user);
    return this.generateTokenResponse(linked);
  }

  async refreshToken(userId: string, tokenVersion?: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        roles: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    // Validate token version — reject tokens issued before a forced logout
    if (tokenVersion !== undefined && tokenVersion !== user.tokenVersion) {
      throw new UnauthorizedException('Token has been revoked');
    }

    // Increment token version to invalidate the old refresh token
    await this.prisma.user.update({
      where: { id: userId },
      data: { tokenVersion: { increment: 1 } },
    });

    return this.generateTokenResponse({ ...user, tokenVersion: user.tokenVersion + 1 });
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        roles: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return {
      id: user.id,
      email: user.email,
      staffId: user.profile?.staffId ?? null,
      roles: user.roles.map((r) => r.role),
      isAdmin: user.roles.some((r) => r.role === 'admin'),
    };
  }

  generateTokenResponse(user: UserWithRelations & { tokenVersion?: number }) {
    const accessPayload = {
      sub: user.id,
      email: user.email,
      staffId: user.profile?.staffId ?? null,
      roles: user.roles.map((r) => r.role),
    };

    const refreshPayload = {
      sub: user.id,
      email: user.email,
      type: 'refresh',
      tokenVersion: user.tokenVersion ?? 0,
    };

    const accessToken = this.jwtService.sign(accessPayload);
    const refreshToken = this.jwtService.sign(refreshPayload, {
      secret: this.refreshTokenSecret,
      expiresIn: '3h', // Refresh token expires in 3 hours
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: 900, // 15 minutes in seconds
      user: {
        id: user.id,
        email: user.email,
        staffId: user.profile?.staffId ?? null,
        roles: user.roles.map((r) => r.role),
        isAdmin: user.roles.some((r) => r.role === 'admin'),
      },
    };
  }
}
