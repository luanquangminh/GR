import { Test, TestingModule } from '@nestjs/testing';
import { EvaluationsController } from './evaluations.controller';
import { EvaluationsService } from './evaluations.service';

describe('EvaluationsController', () => {
  let controller: EvaluationsController;
  let service: EvaluationsService;

  const mockEvaluationsService = {
    findAll: jest.fn(),
    findByReviewer: jest.fn(),
    findByEvaluatee: jest.fn(),
    findGroupsByStaff: jest.fn(),
    findColleagues: jest.fn(),
    getStaff2Groups: jest.fn(),
    bulkUpsert: jest.fn(),
  };

  const mockUser = {
    id: 'user-123',
    sub: 'user-123',
    email: 'test@example.com',
    staffId: 1,
    roles: ['user'],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EvaluationsController],
      providers: [
        {
          provide: EvaluationsService,
          useValue: mockEvaluationsService,
        },
      ],
    }).compile();

    controller = module.get<EvaluationsController>(EvaluationsController);
    service = module.get<EvaluationsService>(EvaluationsService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all evaluations without filters', async () => {
      const mockEvaluations = [
        { id: 1, groupid: 1, reviewerid: 1, evaluateeid: 2, point: 4 },
      ];
      mockEvaluationsService.findAll.mockResolvedValue(mockEvaluations);

      const result = await controller.findAll();

      expect(result).toEqual(mockEvaluations);
      expect(mockEvaluationsService.findAll).toHaveBeenCalledWith({
        groupId: undefined,
        reviewerId: undefined,
        evaluateeId: undefined,
        periodId: undefined,
      });
    });

    it('should filter by periodId', async () => {
      mockEvaluationsService.findAll.mockResolvedValue([]);

      await controller.findAll(undefined, undefined, undefined, '1');

      expect(mockEvaluationsService.findAll).toHaveBeenCalledWith({
        groupId: undefined,
        reviewerId: undefined,
        evaluateeId: undefined,
        periodId: 1,
      });
    });

    it('should filter by multiple params', async () => {
      mockEvaluationsService.findAll.mockResolvedValue([]);

      await controller.findAll('1', '2', '3', '1');

      expect(mockEvaluationsService.findAll).toHaveBeenCalledWith({
        groupId: 1,
        reviewerId: 2,
        evaluateeId: 3,
        periodId: 1,
      });
    });
  });

  describe('findMy', () => {
    it('should return evaluations given by current user', async () => {
      const mockEvaluations = [{ id: 1, reviewerid: 1, evaluateeid: 2, point: 4 }];
      mockEvaluationsService.findByReviewer.mockResolvedValue(mockEvaluations);

      const result = await controller.findMy(mockUser);

      expect(result).toEqual(mockEvaluations);
      expect(mockEvaluationsService.findByReviewer).toHaveBeenCalledWith(1, undefined, undefined);
    });

    it('should filter by groupId and periodId', async () => {
      mockEvaluationsService.findByReviewer.mockResolvedValue([]);

      await controller.findMy(mockUser, '1', '2');

      expect(mockEvaluationsService.findByReviewer).toHaveBeenCalledWith(1, 1, 2);
    });
  });

  describe('findReceived', () => {
    it('should return evaluations received by current user', async () => {
      const mockEvaluations = [
        { id: 1, reviewerid: 2, evaluateeid: 1, point: 4, reviewer: { id: 2, name: 'Reviewer' } },
      ];
      mockEvaluationsService.findByEvaluatee.mockResolvedValue(mockEvaluations);

      const result = await controller.findReceived(mockUser);

      expect(result).toEqual(mockEvaluations);
      expect(mockEvaluationsService.findByEvaluatee).toHaveBeenCalledWith(1, undefined, undefined);
    });

    it('should filter by groupId and periodId', async () => {
      mockEvaluationsService.findByEvaluatee.mockResolvedValue([]);

      await controller.findReceived(mockUser, '1', '2');

      expect(mockEvaluationsService.findByEvaluatee).toHaveBeenCalledWith(1, 1, 2);
    });
  });

  describe('findMyGroups', () => {
    it('should return groups for current user', async () => {
      const mockGroups = [{ id: 1, name: 'Group 1' }];
      mockEvaluationsService.findGroupsByStaff.mockResolvedValue(mockGroups);

      const result = await controller.findMyGroups(mockUser);

      expect(result).toEqual(mockGroups);
      expect(mockEvaluationsService.findGroupsByStaff).toHaveBeenCalledWith(1);
    });
  });

  describe('findColleagues', () => {
    it('should return colleagues in a group', async () => {
      const mockColleagues = [
        { id: 2, name: 'Colleague 1', staffcode: 'GV002' },
      ];
      mockEvaluationsService.findColleagues.mockResolvedValue(mockColleagues);

      const result = await controller.findColleagues(1, mockUser);

      expect(result).toEqual(mockColleagues);
      expect(mockEvaluationsService.findColleagues).toHaveBeenCalledWith(1, 1);
    });
  });

  describe('getStaff2Groups', () => {
    it('should return all staff-group relationships', async () => {
      const mockRelationships = [
        { staffid: 1, groupid: 1, staff: { name: 'Staff 1' }, group: { name: 'Group 1' } },
      ];
      mockEvaluationsService.getStaff2Groups.mockResolvedValue(mockRelationships);

      const result = await controller.getStaff2Groups();

      expect(result).toEqual(mockRelationships);
    });
  });

  describe('bulkUpsert', () => {
    it('should create/update evaluations with periodId', async () => {
      const dto = {
        groupId: 1,
        evaluateeId: 2,
        periodId: 1,
        evaluations: { 1: 4, 2: 5 },
      };
      const mockResults = [{ id: 1, point: 4 }, { id: 2, point: 5 }];
      mockEvaluationsService.bulkUpsert.mockResolvedValue(mockResults);

      const result = await controller.bulkUpsert(dto, mockUser);

      expect(result).toEqual(mockResults);
      expect(mockEvaluationsService.bulkUpsert).toHaveBeenCalledWith(dto, 1);
    });
  });
});
