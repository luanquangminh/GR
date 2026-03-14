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
exports.EvaluationPeriodsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let EvaluationPeriodsService = class EvaluationPeriodsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return this.prisma.evaluationPeriod.findMany({
            orderBy: { startDate: 'desc' },
        });
    }
    async findOne(id) {
        const period = await this.prisma.evaluationPeriod.findUnique({
            where: { id },
        });
        if (!period) {
            throw new common_1.NotFoundException(`Evaluation period with ID ${id} not found`);
        }
        return period;
    }
    async findActive() {
        return this.prisma.evaluationPeriod.findMany({
            where: { status: 'active' },
            orderBy: { startDate: 'desc' },
        });
    }
    async create(dto) {
        const startDate = new Date(dto.startDate);
        const endDate = new Date(dto.endDate);
        if (endDate <= startDate) {
            throw new common_1.BadRequestException('End date must be after start date');
        }
        return this.prisma.evaluationPeriod.create({
            data: {
                name: dto.name,
                description: dto.description,
                startDate,
                endDate,
            },
        });
    }
    async update(id, dto) {
        const period = await this.prisma.evaluationPeriod.findUnique({ where: { id } });
        if (!period) {
            throw new common_1.NotFoundException(`Evaluation period with ID ${id} not found`);
        }
        const data = {};
        if (dto.name !== undefined)
            data.name = dto.name;
        if (dto.description !== undefined)
            data.description = dto.description;
        if (dto.startDate !== undefined)
            data.startDate = new Date(dto.startDate);
        if (dto.endDate !== undefined)
            data.endDate = new Date(dto.endDate);
        if (dto.status !== undefined)
            data.status = dto.status;
        return this.prisma.evaluationPeriod.update({
            where: { id },
            data,
        });
    }
    async remove(id) {
        const period = await this.prisma.evaluationPeriod.findUnique({ where: { id } });
        if (!period) {
            throw new common_1.NotFoundException(`Evaluation period with ID ${id} not found`);
        }
        return this.prisma.evaluationPeriod.delete({ where: { id } });
    }
};
exports.EvaluationPeriodsService = EvaluationPeriodsService;
exports.EvaluationPeriodsService = EvaluationPeriodsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EvaluationPeriodsService);
//# sourceMappingURL=evaluation-periods.service.js.map