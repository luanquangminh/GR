import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;
  let jwtService: JwtService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn().mockReturnValue('test-jwt-secret'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    const registerDto = {
      email: 'test@example.com',
      password: 'Password123',
    };

    it('should register a new user successfully', async () => {
      const mockUser = {
        id: 'user-123',
        email: registerDto.email,
        passwordHash: 'hashed-password',
        profile: { staffId: null },
        roles: [{ role: 'user' }],
      };

      mockPrismaService.user.findUnique.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
      mockPrismaService.user.create.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('jwt-token');

      const result = await service.register(registerDto);

      expect(result).toHaveProperty('accessToken', 'jwt-token');
      expect(result).toHaveProperty('user');
      expect(result.user.email).toBe(registerDto.email);
      expect(bcrypt.hash).toHaveBeenCalledWith(registerDto.password, 10);
    });

    it('should throw ConflictException when email already exists (local user)', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'existing-user',
        passwordHash: 'some-hash',
      });

      await expect(service.register(registerDto)).rejects.toThrow(ConflictException);
      await expect(service.register(registerDto)).rejects.toThrow('Email already registered');
    });

    it('should throw ConflictException with Microsoft hint when email belongs to OAuth user', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'existing-user',
        passwordHash: null,
        provider: 'microsoft',
      });

      await expect(service.register(registerDto)).rejects.toThrow(ConflictException);
      await expect(service.register(registerDto)).rejects.toThrow(
        'This email is registered via Microsoft',
      );
    });
  });

  describe('login', () => {
    const loginDto = {
      email: 'test@example.com',
      password: 'Password123',
    };

    it('should login successfully with valid credentials', async () => {
      const mockUser = {
        id: 'user-123',
        email: loginDto.email,
        passwordHash: 'hashed-password',
        profile: { staffId: 1 },
        roles: [{ role: 'user' }],
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.sign.mockReturnValue('jwt-token');

      const result = await service.login(loginDto);

      expect(result).toHaveProperty('accessToken', 'jwt-token');
      expect(result).toHaveProperty('user');
      expect(result.user.email).toBe(loginDto.email);
      expect(result.user.staffId).toBe(1);
    });

    it('should throw UnauthorizedException when user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
      await expect(service.login(loginDto)).rejects.toThrow('Invalid credentials');
    });

    it('should throw UnauthorizedException when user has no password (OAuth-only)', async () => {
      const mockUser = {
        id: 'user-123',
        email: loginDto.email,
        passwordHash: null,
        provider: 'microsoft',
        profile: null,
        roles: [],
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
      await expect(service.login(loginDto)).rejects.toThrow(
        'This account uses Microsoft sign-in',
      );
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      const mockUser = {
        id: 'user-123',
        email: loginDto.email,
        passwordHash: 'hashed-password',
        profile: null,
        roles: [],
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
      await expect(service.login(loginDto)).rejects.toThrow('Invalid credentials');
    });
  });

  describe('refreshToken', () => {
    it('should refresh token successfully', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        tokenVersion: 0,
        profile: { staffId: 1 },
        roles: [{ role: 'user' }],
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.user.update.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('new-jwt-token');

      const result = await service.refreshToken('user-123', 0);

      expect(result).toHaveProperty('accessToken', 'new-jwt-token');
      expect(result).toHaveProperty('user');
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: 'user-123' },
        data: { tokenVersion: { increment: 1 } },
      });
    });

    it('should throw UnauthorizedException when user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.refreshToken('invalid-user')).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when token version mismatch', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        tokenVersion: 2,
        profile: { staffId: 1 },
        roles: [{ role: 'user' }],
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      await expect(service.refreshToken('user-123', 1)).rejects.toThrow('Token has been revoked');
    });
  });

  describe('getMe', () => {
    it('should return user info', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        profile: { staffId: 1 },
        roles: [{ role: 'admin' }, { role: 'user' }],
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.getMe('user-123');

      expect(result).toEqual({
        id: 'user-123',
        email: 'test@example.com',
        staffId: 1,
        roles: ['admin', 'user'],
        isAdmin: true,
      });
    });

    it('should return isAdmin false when user has no admin role', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        profile: { staffId: 1 },
        roles: [{ role: 'user' }],
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.getMe('user-123');

      expect(result.isAdmin).toBe(false);
    });

    it('should return null staffId when no profile', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        profile: null,
        roles: [{ role: 'user' }],
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.getMe('user-123');

      expect(result.staffId).toBeNull();
    });

    it('should throw UnauthorizedException when user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.getMe('invalid-user')).rejects.toThrow(UnauthorizedException);
    });
  });
});
