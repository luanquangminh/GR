import { IsString, IsOptional, IsDateString, IsEnum } from 'class-validator';
import { PeriodStatus } from '@prisma/client';

export class CreateEvaluationPeriodDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;
}

export class UpdateEvaluationPeriodDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsEnum(PeriodStatus, { message: 'Status must be draft, active, or closed' })
  status?: PeriodStatus;
}
