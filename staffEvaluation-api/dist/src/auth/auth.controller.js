"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AuthController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const throttler_1 = require("@nestjs/throttler");
const swagger_1 = require("@nestjs/swagger");
const config_1 = require("@nestjs/config");
const express = __importStar(require("express"));
const auth_service_1 = require("./auth.service");
const microsoft_oauth_service_1 = require("./microsoft-oauth.service");
const login_dto_1 = require("./dto/login.dto");
const register_dto_1 = require("./dto/register.dto");
const refresh_token_dto_1 = require("./dto/refresh-token.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
let AuthController = AuthController_1 = class AuthController {
    authService;
    microsoftOAuthService;
    configService;
    logger = new common_1.Logger(AuthController_1.name);
    frontendUrl;
    constructor(authService, microsoftOAuthService, configService) {
        this.authService = authService;
        this.microsoftOAuthService = microsoftOAuthService;
        this.configService = configService;
        this.frontendUrl =
            this.configService.get('FRONTEND_URL') || 'http://localhost:5173';
    }
    register(dto) {
        return this.authService.register(dto);
    }
    login(dto) {
        return this.authService.login(dto);
    }
    getMe(user) {
        return this.authService.getMe(user.id);
    }
    refresh(dto, user) {
        return this.authService.refreshToken(user.id);
    }
    microsoftLogin(res) {
        const url = this.microsoftOAuthService.getAuthorizationUrl();
        return res.redirect(url);
    }
    async microsoftCallback(code, error, errorDescription, res) {
        if (error) {
            this.logger.warn(`Microsoft OAuth error: ${error} - ${errorDescription}`);
            return res.redirect(`${this.frontendUrl}/auth/callback?error=${encodeURIComponent(error)}`);
        }
        if (!code) {
            return res.redirect(`${this.frontendUrl}/auth/callback?error=no_code`);
        }
        try {
            const tokenResponse = await this.microsoftOAuthService.exchangeCode(code);
            const profile = this.microsoftOAuthService.decodeIdToken(tokenResponse.id_token);
            if (!this.microsoftOAuthService.validateHustDomain(profile.email)) {
                return res.redirect(`${this.frontendUrl}/auth/callback?error=invalid_domain`);
            }
            const user = await this.microsoftOAuthService.findOrCreateUser(profile);
            const tokens = this.authService.generateTokenResponse(user);
            const oneTimeCode = this.microsoftOAuthService.storeOneTimeCode(tokens.accessToken, tokens.refreshToken);
            return res.redirect(`${this.frontendUrl}/auth/callback?code=${oneTimeCode}`);
        }
        catch (err) {
            this.logger.error('Microsoft OAuth callback error', err);
            return res.redirect(`${this.frontendUrl}/auth/callback?error=server_error`);
        }
    }
    microsoftToken(code) {
        if (!code || typeof code !== 'string') {
            throw new common_1.UnauthorizedException('Invalid or expired code');
        }
        const tokens = this.microsoftOAuthService.consumeOneTimeCode(code);
        if (!tokens) {
            throw new common_1.UnauthorizedException('Invalid or expired code');
        }
        return tokens;
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    (0, common_1.UseGuards)(throttler_1.ThrottlerGuard),
    (0, throttler_1.Throttle)({ default: { limit: 5, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Register a new user' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'User registered successfully' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Email already registered' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.RegisterDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.UseGuards)(throttler_1.ThrottlerGuard),
    (0, throttler_1.Throttle)({ default: { limit: 10, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Login with email and password' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Login successful, returns access and refresh tokens' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Invalid credentials' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('me'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get current user profile' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User profile' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "getMe", null);
__decorate([
    (0, common_1.Post)('refresh'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt-refresh')),
    (0, swagger_1.ApiOperation)({ summary: 'Refresh access token using refresh token' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'New access and refresh tokens' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Invalid or expired refresh token' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [refresh_token_dto_1.RefreshTokenDto, Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "refresh", null);
__decorate([
    (0, common_1.Get)('microsoft'),
    (0, swagger_1.ApiOperation)({ summary: 'Redirect to Microsoft login page' }),
    (0, swagger_1.ApiResponse)({ status: 302, description: 'Redirect to Microsoft OAuth' }),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "microsoftLogin", null);
__decorate([
    (0, common_1.Get)('microsoft/callback'),
    (0, swagger_1.ApiOperation)({ summary: 'Microsoft OAuth callback' }),
    (0, swagger_1.ApiResponse)({ status: 302, description: 'Redirect to frontend with tokens' }),
    __param(0, (0, common_1.Query)('code')),
    __param(1, (0, common_1.Query)('error')),
    __param(2, (0, common_1.Query)('error_description')),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "microsoftCallback", null);
__decorate([
    (0, common_1.Post)('microsoft/token'),
    (0, common_1.UseGuards)(throttler_1.ThrottlerGuard),
    (0, throttler_1.Throttle)({ default: { limit: 10, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Exchange one-time code for JWT tokens after Microsoft OAuth' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns access and refresh tokens' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Invalid or expired code' }),
    __param(0, (0, common_1.Body)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "microsoftToken", null);
exports.AuthController = AuthController = AuthController_1 = __decorate([
    (0, swagger_1.ApiTags)('auth'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        microsoft_oauth_service_1.MicrosoftOAuthService,
        config_1.ConfigService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map