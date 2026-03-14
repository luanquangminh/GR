import { ConfigService } from '@nestjs/config';
import * as express from 'express';
import { AuthService } from './auth.service';
import { MicrosoftOAuthService } from './microsoft-oauth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtPayload } from './strategies/jwt.strategy';
export declare class AuthController {
    private authService;
    private microsoftOAuthService;
    private configService;
    private readonly logger;
    private readonly frontendUrl;
    constructor(authService: AuthService, microsoftOAuthService: MicrosoftOAuthService, configService: ConfigService);
    register(dto: RegisterDto): Promise<{
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
        user: {
            id: string;
            email: string;
            staffId: number | null;
            roles: import("@prisma/client").$Enums.AppRole[];
            isAdmin: boolean;
        };
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
        user: {
            id: string;
            email: string;
            staffId: number | null;
            roles: import("@prisma/client").$Enums.AppRole[];
            isAdmin: boolean;
        };
    }>;
    getMe(user: JwtPayload & {
        id: string;
    }): Promise<{
        id: string;
        email: string;
        staffId: number | null;
        roles: import("@prisma/client").$Enums.AppRole[];
        isAdmin: boolean;
    }>;
    refresh(dto: RefreshTokenDto, user: JwtPayload & {
        id: string;
    }): Promise<{
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
        user: {
            id: string;
            email: string;
            staffId: number | null;
            roles: import("@prisma/client").$Enums.AppRole[];
            isAdmin: boolean;
        };
    }>;
    microsoftLogin(res: express.Response): void;
    microsoftCallback(code: string, error: string, errorDescription: string, res: express.Response): Promise<void>;
    microsoftToken(code: string): {
        accessToken: string;
        refreshToken: string;
    };
}
