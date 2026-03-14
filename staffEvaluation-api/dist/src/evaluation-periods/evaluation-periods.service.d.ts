import { PrismaService } from '../prisma/prisma.service';
import { CreateEvaluationPeriodDto, UpdateEvaluationPeriodDto } from './dto/evaluation-periods.dto';
export declare class EvaluationPeriodsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: number;
        name: string;
        description: string | null;
        startDate: Date;
        endDate: Date;
        status: import("@prisma/client").$Enums.PeriodStatus;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: number): Promise<{
        id: number;
        name: string;
        description: string | null;
        startDate: Date;
        endDate: Date;
        status: import("@prisma/client").$Enums.PeriodStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findActive(): Promise<{
        id: number;
        name: string;
        description: string | null;
        startDate: Date;
        endDate: Date;
        status: import("@prisma/client").$Enums.PeriodStatus;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    create(dto: CreateEvaluationPeriodDto): Promise<{
        id: number;
        name: string;
        description: string | null;
        startDate: Date;
        endDate: Date;
        status: import("@prisma/client").$Enums.PeriodStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: number, dto: UpdateEvaluationPeriodDto): Promise<{
        id: number;
        name: string;
        description: string | null;
        startDate: Date;
        endDate: Date;
        status: import("@prisma/client").$Enums.PeriodStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: number): Promise<{
        id: number;
        name: string;
        description: string | null;
        startDate: Date;
        endDate: Date;
        status: import("@prisma/client").$Enums.PeriodStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
