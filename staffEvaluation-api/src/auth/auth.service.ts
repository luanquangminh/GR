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
import { User, Profile, UserRole } from '@prisma/client';

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

    return this.generateTokenResponse(user);
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

    return this.generateTokenResponse(user);
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
