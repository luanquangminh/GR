import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEvaluationPeriodDto, UpdateEvaluationPeriodDto } from './dto/evaluation-periods.dto';

@Injectable()
export class EvaluationPeriodsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.evaluationPeriod.findMany({
      orderBy: { startDate: 'desc' },
    });
  }

  async findOne(id: number) {
    const period = await this.prisma.evaluationPeriod.findUnique({
      where: { id },
    });

    if (!period) {
      throw new NotFoundException(`Evaluation period with ID ${id} not found`);
    }

    return period;
  }

  async findActive() {
    return this.prisma.evaluationPeriod.findMany({
      where: { status: 'active' },
      orderBy: { startDate: 'desc' },
    });
  }

  async create(dto: CreateEvaluationPeriodDto) {
    const startDate = new Date(dto.startDate);
    const endDate = new Date(dto.endDate);

    if (endDate <= startDate) {
      throw new BadRequestException('End date must be after start date');
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

  async update(id: number, dto: UpdateEvaluationPeriodDto) {
    const period = await this.prisma.evaluationPeriod.findUnique({ where: { id } });

    if (!period) {
      throw new NotFoundException(`Evaluation period with ID ${id} not found`);
    }

    const data: any = {};
    if (dto.name !== undefined) data.name = dto.name;
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.startDate !== undefined) data.startDate = new Date(dto.startDate);
    if (dto.endDate !== undefined) data.endDate = new Date(dto.endDate);
    if (dto.status !== undefined) data.status = dto.status;

    return this.prisma.evaluationPeriod.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    const period = await this.prisma.evaluationPeriod.findUnique({ where: { id } });

    if (!period) {
      throw new NotFoundException(`Evaluation period with ID ${id} not found`);
    }

    return this.prisma.evaluationPeriod.delete({ where: { id } });
  }
}
