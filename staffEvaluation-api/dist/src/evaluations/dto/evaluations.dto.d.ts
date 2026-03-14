export declare class BulkEvaluationDto {
    groupId: number;
    evaluateeId: number;
    periodId: number;
    evaluations: Record<number, number>;
}
export declare class EvaluationQueryDto {
    groupId?: number;
    reviewerId?: number;
    evaluateeId?: number;
    periodId?: number;
}
