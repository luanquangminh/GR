import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
  ) {
    const dedicatedSecret = config.get<string>('JWT_REFRESH_SECRET');
    const jwtSecret = config.get<string>('JWT_SECRET');
    const refreshSecret = dedicatedSecret || (jwtSecret ? jwtSecret + '-refresh' : null);
    if (!refreshSecret) {
      throw new Error('JWT_REFRESH_SECRET or JWT_SECRET environment variable must be configured');
    }
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      secretOrKey: refreshSecret,
    });
  }

  async validate(payload: { sub: string; email: string; type: string; tokenVersion?: number }) {
    if (payload.type !== 'refresh') {
      throw new UnauthorizedException('Invalid token type');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
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
      staffId: user.profile?.staffId || null,
      roles: user.roles.map((r) => r.role),
      tokenVersion: payload.tokenVersion,
    };
  }
}
