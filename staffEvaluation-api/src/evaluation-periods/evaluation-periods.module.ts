import { Module } from '@nestjs/common';
import { EvaluationPeriodsService } from './evaluation-periods.service';
import { EvaluationPeriodsController } from './evaluation-periods.controller';

@Module({
  controllers: [EvaluationPeriodsController],
  providers: [EvaluationPeriodsService],
  exports: [EvaluationPeriodsService],
})
export class EvaluationPeriodsModule {}
