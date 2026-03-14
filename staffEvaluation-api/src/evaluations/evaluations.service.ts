import { Injectable, ForbiddenException, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { BulkEvaluationDto } from './dto/evaluations.dto';

@Injectable()
export class EvaluationsService {
  constructor(private prisma: PrismaService) { }

  async findAll(query?: { groupId?: number; reviewerId?: number; evaluateeId?: number; periodId?: number }) {
    const where: Prisma.EvaluationWhereInput = {};
    if (query?.groupId) where.groupid = query.groupId;
    if (query?.reviewerId) where.reviewerid = query.reviewerId;
    if (query?.evaluateeId) where.evaluateeid = query.evaluateeId;
    if (query?.periodId) where.periodid = query.periodId;

    return this.prisma.evaluation.findMany({
      where,
      include: {
        reviewer: true,
        evaluatee: true,
        group: true,
        question: true,
        period: true,
      },
    });
  }

  async findByReviewer(staffId: number, groupId?: number, periodId?: number) {
    const where: Prisma.EvaluationWhereInput = { reviewerid: staffId };
    if (groupId) where.groupid = groupId;
    if (periodId) where.periodid = periodId;

    return this.prisma.evaluation.findMany({
      where,
      include: {
        evaluatee: true,
        question: true,
        period: true,
      },
    });
  }

  async findByEvaluatee(staffId: number, groupId?: number, periodId?: number) {
    const where: Prisma.EvaluationWhereInput = { evaluateeid: staffId };
    if (groupId) where.groupid = groupId;
    if (periodId) where.periodid = periodId;

    return this.prisma.evaluation.findMany({
      where,
      include: {
        reviewer: true,
        question: true,
        group: true,
        period: true,
      },
    });
  }

  async findGroupsByStaff(staffId: number) {
    const staffGroups = await this.prisma.staff2Group.findMany({
      where: { staffid: staffId },
      include: {
        group: true,
      },
    });

    return staffGroups.map((sg) => sg.group);
  }

  async findColleagues(groupId: number, myStaffId: number) {
    const staffGroups = await this.prisma.staff2Group.findMany({
      where: {
        groupid: groupId,
        NOT: { staffid: myStaffId },
      },
      include: {
        staff: true,
      },
    });

    return staffGroups.map((sg) => sg.staff);
  }

  async bulkUpsert(dto: BulkEvaluationDto, reviewerStaffId: number) {
    if (!reviewerStaffId) {
      throw new ForbiddenException('Staff ID is required');
    }

    // Authorization check: Prevent self-evaluation
    if (reviewerStaffId === dto.evaluateeId) {
      throw new ForbiddenException('Cannot evaluate yourself');
    }

    // Verify the period exists and is active
    const period = await this.prisma.evaluationPeriod.findUnique({
      where: { id: dto.periodId },
    });
    if (!period) {
      throw new NotFoundException('Evaluation period not found');
    }
    if (period.status !== 'active') {
      throw new BadRequestException('Evaluation period is not active');
    }

    // Authorization check: Verify reviewer is a member of the group
    const reviewerInGroup = await this.prisma.staff2Group.findFirst({
      where: { staffid: reviewerStaffId, groupid: dto.groupId },
    });
    if (!reviewerInGroup) {
      throw new ForbiddenException('You are not a member of this group');
    }

    // Authorization check: Verify evaluatee is a member of the group
    const evaluateeInGroup = await this.prisma.staff2Group.findFirst({
      where: { staffid: dto.evaluateeId, groupid: dto.groupId },
    });
    if (!evaluateeInGroup) {
      throw new BadRequestException('Target staff is not a member of this group');
    }

    // Validate point values (additional server-side validation)
    for (const point of Object.values(dto.evaluations)) {
      if (typeof point !== 'number' || point < 0 || point > 4 || !Number.isFinite(point)) {
        throw new BadRequestException('All evaluation points must be numbers between 0 and 4');
      }
    }

    // Use transaction for atomic upsert operations
    const results = await this.prisma.$transaction(
      Object.entries(dto.evaluations).map(([questionIdStr, point]) => {
        const questionId = parseInt(questionIdStr, 10);
        return this.prisma.evaluation.upsert({
          where: {
            reviewer_evaluatee_group_question_period: {
              reviewerid: reviewerStaffId,
              evaluateeid: dto.evaluateeId,
              groupid: dto.groupId,
              questionid: questionId,
              periodid: dto.periodId,
            },
          },
          update: {
            point,
          },
          create: {
            reviewerid: reviewerStaffId,
            evaluateeid: dto.evaluateeId,
            groupid: dto.groupId,
            questionid: questionId,
            periodid: dto.periodId,
            point,
          },
        });
      })
    );

    return results;
  }

  async getStaff2Groups() {
    return this.prisma.staff2Group.findMany({
      include: {
        staff: true,
        group: true,
      },
    });
  }
}
