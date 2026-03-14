import { Test, TestingModule } from '@nestjs/testing';
import { EvaluationPeriodsService } from './evaluation-periods.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('EvaluationPeriodsService', () => {
  let service: EvaluationPeriodsService;

  const mockPrismaService = {
    evaluationPeriod: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EvaluationPeriodsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<EvaluationPeriodsService>(EvaluationPeriodsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all evaluation periods', async () => {
      const mockPeriods = [
        { id: 1, name: 'HK1', status: 'closed' },
        { id: 2, name: 'HK2', status: 'active' },
      ];
      mockPrismaService.evaluationPeriod.findMany.mockResolvedValue(mockPeriods);

      const result = await service.findAll();

      expect(result).toEqual(mockPeriods);
      expect(mockPrismaService.evaluationPeriod.findMany).toHaveBeenCalledWith({
        orderBy: { startDate: 'desc' },
      });
    });
  });

  describe('findOne', () => {
    it('should return a period by id', async () => {
      const mockPeriod = { id: 1, name: 'HK1', status: 'active' };
      mockPrismaService.evaluationPeriod.findUnique.mockResolvedValue(mockPeriod);

      const result = await service.findOne(1);

      expect(result).toEqual(mockPeriod);
    });

    it('should throw NotFoundException when period not found', async () => {
      mockPrismaService.evaluationPeriod.findUnique.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findActive', () => {
    it('should return only active periods', async () => {
      const mockPeriods = [{ id: 2, name: 'HK2', status: 'active' }];
      mockPrismaService.evaluationPeriod.findMany.mockResolvedValue(mockPeriods);

      const result = await service.findActive();

      expect(result).toEqual(mockPeriods);
      expect(mockPrismaService.evaluationPeriod.findMany).toHaveBeenCalledWith({
        where: { status: 'active' },
        orderBy: { startDate: 'desc' },
      });
    });
  });

  describe('create', () => {
    it('should create a new period', async () => {
      const dto = {
        name: 'HK1 2025-2026',
        startDate: '2025-09-01',
        endDate: '2026-01-31',
      };
      const mockCreated = { id: 3, ...dto, status: 'draft' };
      mockPrismaService.evaluationPeriod.create.mockResolvedValue(mockCreated);

      const result = await service.create(dto);

      expect(result).toEqual(mockCreated);
    });

    it('should throw BadRequestException when endDate is before startDate', async () => {
      const dto = {
        name: 'Invalid period',
        startDate: '2025-06-01',
        endDate: '2025-01-01',
      };

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    it('should update a period', async () => {
      const mockPeriod = { id: 1, name: 'HK1', status: 'draft' };
      mockPrismaService.evaluationPeriod.findUnique.mockResolvedValue(mockPeriod);
      mockPrismaService.evaluationPeriod.update.mockResolvedValue({ ...mockPeriod, status: 'active' });

      const result = await service.update(1, { status: 'active' as any });

      expect(result.status).toBe('active');
    });

    it('should throw NotFoundException when period not found', async () => {
      mockPrismaService.evaluationPeriod.findUnique.mockResolvedValue(null);

      await expect(service.update(999, { name: 'Test' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a period', async () => {
      const mockPeriod = { id: 1, name: 'HK1' };
      mockPrismaService.evaluationPeriod.findUnique.mockResolvedValue(mockPeriod);
      mockPrismaService.evaluationPeriod.delete.mockResolvedValue(mockPeriod);

      const result = await service.remove(1);

      expect(result).toEqual(mockPeriod);
    });

    it('should throw NotFoundException when period not found', async () => {
      mockPrismaService.evaluationPeriod.findUnique.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
