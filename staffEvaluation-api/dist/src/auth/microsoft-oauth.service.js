"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MicrosoftOAuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MicrosoftOAuthService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const config_1 = require("@nestjs/config");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
let MicrosoftOAuthService = MicrosoftOAuthService_1 = class MicrosoftOAuthService {
    configService;
    prisma;
    logger = new common_1.Logger(MicrosoftOAuthService_1.name);
    clientId;
    clientSecret;
    tenantId;
    redirectUri;
    pendingCodes = new Map();
    constructor(configService, prisma) {
        this.configService = configService;
        this.prisma = prisma;
        this.clientId = this.configService.get('AZURE_CLIENT_ID') || '';
        this.clientSecret =
            this.configService.get('AZURE_CLIENT_SECRET') || '';
        this.tenantId = this.configService.get('AZURE_TENANT_ID') || '';
        this.redirectUri =
            this.configService.get('AZURE_REDIRECT_URI') ||
                'http://localhost:3001/auth/microsoft/callback';
    }
    getAuthorizationUrl() {
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
    async exchangeCode(code) {
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
            throw new common_1.InternalServerErrorException('Failed to exchange code for tokens');
        }
        return response.json();
    }
    decodeIdToken(idToken) {
        const parts = idToken.split('.');
        if (parts.length !== 3) {
            throw new common_1.BadRequestException('Invalid id_token format');
        }
        const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf-8'));
        const email = (payload.preferred_username ||
            payload.email ||
            payload.upn ||
            '').toLowerCase();
        if (!payload.oid) {
            throw new common_1.BadRequestException('No oid found in id_token');
        }
        if (!email) {
            throw new common_1.BadRequestException('No email found in id_token');
        }
        return {
            oid: payload.oid,
            email,
            displayName: payload.name || email,
        };
    }
    validateHustDomain(email) {
        return /^[^@]+@.+\.hust\.edu\.vn$/i.test(email);
    }
    storeOneTimeCode(accessToken, refreshToken) {
        this.cleanExpiredCodes();
        if (this.pendingCodes.size >= 10_000) {
            throw new common_1.InternalServerErrorException('Too many pending auth requests');
        }
        const code = (0, crypto_1.randomBytes)(32).toString('hex');
        this.pendingCodes.set(code, {
            accessToken,
            refreshToken,
            expiresAt: Date.now() + 60_000,
        });
        return code;
    }
    consumeOneTimeCode(code) {
        const entry = this.pendingCodes.get(code);
        if (!entry)
            return null;
        this.pendingCodes.delete(code);
        if (Date.now() > entry.expiresAt)
            return null;
        return { accessToken: entry.accessToken, refreshToken: entry.refreshToken };
    }
    async findOrCreateUser(profile) {
        const existingByMsId = await this.prisma.user.findUnique({
            where: { microsoftId: profile.oid },
            include: { profile: true, roles: true },
        });
        if (existingByMsId) {
            return existingByMsId;
        }
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
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2002') {
                const retryByMsId = await this.prisma.user.findUnique({
                    where: { microsoftId: profile.oid },
                    include: { profile: true, roles: true },
                });
                if (retryByMsId)
                    return retryByMsId;
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
        const matchingStaff = await this.prisma.staff.findMany({
            where: { schoolEmail: profile.email },
            include: { profile: true },
            take: 2,
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
    generateState() {
        return (0, crypto_1.randomBytes)(16).toString('hex');
    }
    cleanExpiredCodes() {
        const now = Date.now();
        for (const [code, entry] of this.pendingCodes) {
            if (now > entry.expiresAt) {
                this.pendingCodes.delete(code);
            }
        }
    }
};
exports.MicrosoftOAuthService = MicrosoftOAuthService;
exports.MicrosoftOAuthService = MicrosoftOAuthService = MicrosoftOAuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        prisma_service_1.PrismaService])
], MicrosoftOAuthService);
//# sourceMappingURL=microsoft-oauth.service.js.map