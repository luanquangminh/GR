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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvaluationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let EvaluationsService = class EvaluationsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query) {
        const where = {};
        if (query?.groupId)
            where.groupid = query.groupId;
        if (query?.reviewerId)
            where.reviewerid = query.reviewerId;
        if (query?.evaluateeId)
            where.evaluateeid = query.evaluateeId;
        if (query?.periodId)
            where.periodid = query.periodId;
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
    async findByReviewer(staffId, groupId, periodId) {
        const where = { reviewerid: staffId };
        if (groupId)
            where.groupid = groupId;
        if (periodId)
            where.periodid = periodId;
        return this.prisma.evaluation.findMany({
            where,
            include: {
                evaluatee: true,
                question: true,
                period: true,
            },
        });
    }
    async findByEvaluatee(staffId, groupId, periodId) {
        const where = { evaluateeid: staffId };
        if (groupId)
            where.groupid = groupId;
        if (periodId)
            where.periodid = periodId;
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
    async findGroupsByStaff(staffId) {
        const staffGroups = await this.prisma.staff2Group.findMany({
            where: { staffid: staffId },
            include: {
                group: true,
            },
        });
        return staffGroups.map((sg) => sg.group);
    }
    async findColleagues(groupId, myStaffId) {
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
    async bulkUpsert(dto, reviewerStaffId) {
        if (!reviewerStaffId) {
            throw new common_1.ForbiddenException('Staff ID is required');
        }
        if (reviewerStaffId === dto.evaluateeId) {
            throw new common_1.ForbiddenException('Cannot evaluate yourself');
        }
        const period = await this.prisma.evaluationPeriod.findUnique({
            where: { id: dto.periodId },
        });
        if (!period) {
            throw new common_1.NotFoundException('Evaluation period not found');
        }
        if (period.status !== 'active') {
            throw new common_1.BadRequestException('Evaluation period is not active');
        }
        const reviewerInGroup = await this.prisma.staff2Group.findFirst({
            where: { staffid: reviewerStaffId, groupid: dto.groupId },
        });
        if (!reviewerInGroup) {
            throw new common_1.ForbiddenException('You are not a member of this group');
        }
        const evaluateeInGroup = await this.prisma.staff2Group.findFirst({
            where: { staffid: dto.evaluateeId, groupid: dto.groupId },
        });
        if (!evaluateeInGroup) {
            throw new common_1.BadRequestException('Target staff is not a member of this group');
        }
        for (const point of Object.values(dto.evaluations)) {
            if (typeof point !== 'number' || point < 0 || point > 4 || !Number.isFinite(point)) {
                throw new common_1.BadRequestException('All evaluation points must be numbers between 0 and 4');
            }
        }
        const results = await this.prisma.$transaction(Object.entries(dto.evaluations).map(([questionIdStr, point]) => {
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
        }));
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
};
exports.EvaluationsService = EvaluationsService;
exports.EvaluationsService = EvaluationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EvaluationsService);
//# sourceMappingURL=evaluations.service.js.map