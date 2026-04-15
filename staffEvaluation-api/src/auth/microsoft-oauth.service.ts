import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { randomBytes } from 'crypto';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  MicrosoftTokenResponse,
  MicrosoftProfile,
} from './dto/microsoft-oauth.dto';

@Injectable()
export class MicrosoftOAuthService {
  private readonly logger = new Logger(MicrosoftOAuthService.name);
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly tenantId: string;
  private readonly redirectUri: string;

  // In-memory store for one-time auth codes: code → { tokens, expiresAt }
  private readonly pendingCodes = new Map<
    string,
    { accessToken: string; refreshToken: string; expiresAt: number }
  >();

  // In-memory store for OAuth state parameters (CSRF protection)
  private readonly pendingStates = new Set<string>();

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    this.clientId = this.configService.get<string>('AZURE_CLIENT_ID') || '';
    this.clientSecret =
      this.configService.get<string>('AZURE_CLIENT_SECRET') || '';
    this.tenantId = this.configService.get<string>('AZURE_TENANT_ID') || '';
    this.redirectUri =
      this.configService.get<string>('AZURE_REDIRECT_URI') ||
      'http://localhost:3001/auth/microsoft/callback';
  }

  getAuthorizationUrl(): string {
    const params = new URLSearchParams({
      client_id: this.clientId,
      response_type: 'code',
      redirect_uri: this.redirectUri,
      response_mode: 'query',
      scope: 'openid profile email User.Read',
      state: this.generateState(),
    });

    return `https://login.microsoftonline.com/${this.tenantId}/oauth2/v2.0/authorize?${params.toString()}`;
  }

  async exchangeCode(code: string): Promise<MicrosoftTokenResponse> {
    const tokenUrl = `https://login.microsoftonline.com/${this.tenantId}/oauth2/v2.0/token`;

    const body = new URLSearchParams({
      client_id: this.clientId,
      client_secret: this.clientSecret,
      code,
      redirect_uri: this.redirectUri,
      grant_type: 'authorization_code',
      scope: 'openid profile email User.Read',
    });

    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });

    if (!response.ok) {
      const error = await response.text();
      this.logger.error(`Token exchange failed: ${error}`);
      throw new InternalServerErrorException(
        'Failed to exchange code for tokens',
      );
    }

    return response.json() as Promise<MicrosoftTokenResponse>;
  }

  /**
   * Decode id_token payload.
   * NOTE: Signature verification is not needed here because the id_token was received
   * directly from Microsoft's token endpoint over HTTPS (server-to-server) in exchangeCode(),
   * not from an untrusted client. The token exchange guarantees authenticity.
   */
  decodeIdToken(idToken: string): MicrosoftProfile {
    const parts = idToken.split('.');
    if (parts.length !== 3) {
      throw new BadRequestException('Invalid id_token format');
    }

    const payload = JSON.parse(
      Buffer.from(parts[1], 'base64url').toString('utf-8'),
    );

    const email = (
      payload.preferred_username ||
      payload.email ||
      payload.upn ||
      ''
    ).toLowerCase();

    if (!payload.oid) {
      throw new BadRequestException('No oid found in id_token');
    }

    if (!email) {
      throw new BadRequestException('No email found in id_token');
    }

    return {
      oid: payload.oid as string,
      email,
      displayName: payload.name || email,
    };
  }

  validateHustDomain(email: string): boolean {
    // Match exact @hust.edu.vn or direct subdomains like @sis.hust.edu.vn
    return /^[^@]+@([a-z0-9-]+\.)?hust\.edu\.vn$/i.test(email);
  }

  /**
   * Store tokens under a short-lived one-time code.
   * The frontend exchanges this code via POST to get the actual tokens,
   * so tokens never appear in URLs, browser history, or server logs.
   */
  storeOneTimeCode(accessToken: string, refreshToken: string): string {
    this.cleanExpiredCodes();
    // Hard cap to prevent memory abuse — reject if too many pending codes
    if (this.pendingCodes.size >= 10_000) {
      throw new InternalServerErrorException('Too many pending auth requests');
    }
    const code = randomBytes(32).toString('hex');
    this.pendingCodes.set(code, {
      accessToken,
      refreshToken,
      expiresAt: Date.now() + 60_000, // 60 seconds TTL
    });
    return code;
  }

  /**
   * Consume a one-time code and return the associated tokens.
   * Returns null if the code is invalid or expired.
   */
  consumeOneTimeCode(
    code: string,
  ): { accessToken: string; refreshToken: string } | null {
    const entry = this.pendingCodes.get(code);
    if (!entry) return null;

    this.pendingCodes.delete(code);

    if (Date.now() > entry.expiresAt) return null;

    return { accessToken: entry.accessToken, refreshToken: entry.refreshToken };
  }

  async findOrCreateUser(profile: MicrosoftProfile) {
    // 1. Check by microsoftId (returning user)
    const existingByMsId = await this.prisma.user.findUnique({
      where: { microsoftId: profile.oid },
      include: { profile: true, roles: true },
    });
    if (existingByMsId) {
      return existingByMsId;
    }

    // 2. Check by email (link existing account)
    const existingByEmail = await this.prisma.user.findUnique({
      where: { email: profile.email },
      include: { profile: true, roles: true },
    });
    if (existingByEmail) {
      return this.prisma.user.update({
        where: { id: existingByEmail.id },
        data: { microsoftId: profile.oid },
        include: { profile: true, roles: true },
      });
    }

    // 3. Create new user — wrapped in try-catch for race condition on unique constraints
    let user;
    try {
      user = await this.prisma.user.create({
        data: {
          email: profile.email,
          passwordHash: null,
          provider: 'microsoft',
          microsoftId: profile.oid,
          profile: { create: {} },
          roles: { create: { role: 'user' } },
        },
        include: { profile: true, roles: true },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        // Unique constraint violation — another concurrent request created the user first.
        // Retry the lookups.
        const retryByMsId = await this.prisma.user.findUnique({
          where: { microsoftId: profile.oid },
          include: { profile: true, roles: true },
        });
        if (retryByMsId) return retryByMsId;

        const retryByEmail = await this.prisma.user.findUnique({
          where: { email: profile.email },
          include: { profile: true, roles: true },
        });
        if (retryByEmail) {
          return this.prisma.user.update({
            where: { id: retryByEmail.id },
            data: { microsoftId: profile.oid },
            include: { profile: true, roles: true },
          });
        }
      }
      throw error;
    }

    // 4. Try to auto-link to Staff by schoolEmail (only if exactly one match)
    const matchingStaff = await this.prisma.staff.findMany({
      where: { schoolEmail: profile.email },
      include: { profile: true },
      take: 2, // Only need to know if there's more than one
    });

    const staff = matchingStaff.length === 1 ? matchingStaff[0] : null;

    if (staff && !staff.profile) {
      await this.prisma.profile.update({
        where: { userId: user.id },
        data: { staffId: staff.id },
      });

      return this.prisma.user.findUniqueOrThrow({
        where: { id: user.id },
        include: { profile: true, roles: true },
      });
    }

    return user;
  }

  validateState(state: string | undefined): boolean {
    if (!state) return false;
    const valid = this.pendingStates.has(state);
    this.pendingStates.delete(state); // One-time use
    return valid;
  }

  private generateState(): string {
    const state = randomBytes(16).toString('hex');
    this.pendingStates.add(state);
    // Auto-expire after 10 minutes
    setTimeout(() => this.pendingStates.delete(state), 10 * 60 * 1000);
    return state;
  }

  private cleanExpiredCodes(): void {
    const now = Date.now();
    for (const [code, entry] of this.pendingCodes) {
      if (now > entry.expiresAt) {
        this.pendingCodes.delete(code);
      }
    }
  }
}
