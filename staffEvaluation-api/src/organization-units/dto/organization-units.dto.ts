import { IsString, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, PartialType } from '@nestjs/swagger';

const TrimString = () => Transform(({ value }) => typeof value === 'string' ? value.trim() : value);

export class CreateOrganizationUnitDto {
  @ApiProperty({ example: 'Khoa CNTT', description: 'Organization unit name' })
  @IsString()
  @MaxLength(200)
  @TrimString()
  name: string;
}

export class UpdateOrganizationUnitDto extends PartialType(CreateOrganizationUnitDto) { }
