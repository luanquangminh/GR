import { Test, TestingModule } from '@nestjs/testing';
import { EvaluationPeriodsController } from './evaluation-periods.controller';
import { EvaluationPeriodsService } from './evaluation-periods.service';

describe('EvaluationPeriodsController', () => {
  let controller: EvaluationPeriodsController;

  const mockService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    findActive: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EvaluationPeriodsController],
      providers: [
        {
          provide: EvaluationPeriodsService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<EvaluationPeriodsController>(EvaluationPeriodsController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all periods', async () => {
      const mockPeriods = [{ id: 1, name: 'HK1' }, { id: 2, name: 'HK2' }];
      mockService.findAll.mockResolvedValue(mockPeriods);

      const result = await controller.findAll({});

      expect(result).toEqual(mockPeriods);
    });
  });

  describe('findActive', () => {
    it('should return active periods', async () => {
      const mockPeriods = [{ id: 2, name: 'HK2', status: 'active' }];
      mockService.findActive.mockResolvedValue(mockPeriods);

      const result = await controller.findActive();

      expect(result).toEqual(mockPeriods);
    });
  });

  describe('findOne', () => {
    it('should return a period by id', async () => {
      const mockPeriod = { id: 1, name: 'HK1' };
      mockService.findOne.mockResolvedValue(mockPeriod);

      const result = await controller.findOne(1);

      expect(result).toEqual(mockPeriod);
      expect(mockService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('create', () => {
    it('should create a period', async () => {
      const dto = { name: 'HK1', startDate: '2025-09-01', endDate: '2026-01-31' };
      const mockCreated = { id: 1, ...dto, status: 'draft' };
      mockService.create.mockResolvedValue(mockCreated);

      const result = await controller.create(dto);

      expect(result).toEqual(mockCreated);
      expect(mockService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('update', () => {
    it('should update a period', async () => {
      const dto = { status: 'active' as any };
      const mockUpdated = { id: 1, name: 'HK1', status: 'active' };
      mockService.update.mockResolvedValue(mockUpdated);

      const result = await controller.update(1, dto);

      expect(result).toEqual(mockUpdated);
      expect(mockService.update).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('remove', () => {
    it('should delete a period', async () => {
      const mockPeriod = { id: 1, name: 'HK1' };
      mockService.remove.mockResolvedValue(mockPeriod);

      const result = await controller.remove(1);

      expect(result).toEqual(mockPeriod);
      expect(mockService.remove).toHaveBeenCalledWith(1);
    });
  });
});
