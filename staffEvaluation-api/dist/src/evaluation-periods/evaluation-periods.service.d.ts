import { PrismaService } from '../prisma/prisma.service';
import { CreateEvaluationPeriodDto, UpdateEvaluationPeriodDto } from './dto/evaluation-periods.dto';
export declare class EvaluationPeriodsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        startDate: Date;
        endDate: Date;
        status: import("@prisma/client").$Enums.PeriodStatus;
    }[]>;
    findOne(id: number): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        startDate: Date;
        endDate: Date;
        status: import("@prisma/client").$Enums.PeriodStatus;
    }>;
    findActive(): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        startDate: Date;
        endDate: Date;
        status: import("@prisma/client").$Enums.PeriodStatus;
    }[]>;
    create(dto: CreateEvaluationPeriodDto): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        startDate: Date;
        endDate: Date;
        status: import("@prisma/client").$Enums.PeriodStatus;
    }>;
    update(id: number, dto: UpdateEvaluationPeriodDto): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        startDate: Date;
        endDate: Date;
        status: import("@prisma/client").$Enums.PeriodStatus;
    }>;
    remove(id: number): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        startDate: Date;
        endDate: Date;
        status: import("@prisma/client").$Enums.PeriodStatus;
    }>;
}
