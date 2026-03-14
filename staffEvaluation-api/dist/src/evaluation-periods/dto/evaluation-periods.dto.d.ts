import { PeriodStatus } from '@prisma/client';
export declare class CreateEvaluationPeriodDto {
    name: string;
    description?: string;
    startDate: string;
    endDate: string;
}
export declare class UpdateEvaluationPeriodDto {
    name?: string;
    description?: string;
    startDate?: string;
    endDate?: string;
    status?: PeriodStatus;
}
