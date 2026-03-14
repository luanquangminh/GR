import { EvaluationPeriodsService } from './evaluation-periods.service';
import { CreateEvaluationPeriodDto, UpdateEvaluationPeriodDto } from './dto/evaluation-periods.dto';
export declare class EvaluationPeriodsController {
    private evaluationPeriodsService;
    constructor(evaluationPeriodsService: EvaluationPeriodsService);
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
