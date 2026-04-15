import { IsString, IsOptional, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

const TrimString = () => Transform(({ value }) => typeof value === 'string' ? value.trim() : value);

export class CreateQuestionDto {
  @ApiProperty({ example: 'Tinh thần trách nhiệm', description: 'Evaluation criterion title' })
  @IsString()
  @MaxLength(300)
  @TrimString()
  title: string;

  @ApiPropertyOptional({ example: 'Đánh giá mức độ trách nhiệm trong công việc', description: 'Criterion description' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  @TrimString()
  description?: string;
}

export class UpdateQuestionDto extends PartialType(CreateQuestionDto) { }
