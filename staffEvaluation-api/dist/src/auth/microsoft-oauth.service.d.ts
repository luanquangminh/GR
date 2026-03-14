import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { MicrosoftTokenResponse, MicrosoftProfile } from './dto/microsoft-oauth.dto';
export declare class MicrosoftOAuthService {
    private readonly configService;
    private readonly prisma;
    private readonly logger;
    private readonly clientId;
    private readonly clientSecret;
    private readonly tenantId;
    private readonly redirectUri;
    private readonly pendingCodes;
    constructor(configService: ConfigService, prisma: PrismaService);
    getAuthorizationUrl(): string;
    exchangeCode(code: string): Promise<MicrosoftTokenResponse>;
    decodeIdToken(idToken: string): MicrosoftProfile;
    validateHustDomain(email: string): boolean;
    storeOneTimeCode(accessToken: string, refreshToken: string): string;
    consumeOneTimeCode(code: string): {
        accessToken: string;
        refreshToken: string;
    } | null;
    findOrCreateUser(profile: MicrosoftProfile): Promise<{
        profile: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            staffId: number | null;
        } | null;
        roles: {
            id: string;
            createdAt: Date;
            userId: string;
            role: import("@prisma/client").$Enums.AppRole;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        microsoftId: string | null;
        passwordHash: string | null;
        provider: string;
    }>;
    private generateState;
    private cleanExpiredCodes;
}
