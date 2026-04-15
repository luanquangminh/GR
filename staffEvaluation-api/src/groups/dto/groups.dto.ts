import { IsString, IsOptional, IsInt, IsArray, MaxLength, ArrayMaxSize } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

const TrimString = () => Transform(({ value }) => typeof value === 'string' ? value.trim() : value);

export class CreateGroupDto {
  @ApiProperty({ example: 'Nhóm CNPM', description: 'Group name' })
  @IsString()
  @MaxLength(200)
  @TrimString()
  name: string;

  @ApiPropertyOptional({ example: 1, description: 'Organization unit ID' })
  @IsOptional()
  @IsInt()
  organizationunitid?: number;
}

export class UpdateGroupDto extends PartialType(CreateGroupDto) { }

export class UpdateGroupMembersDto {
  @ApiProperty({ example: [1, 2, 3], description: 'Array of staff IDs to set as members' })
  @IsArray()
  @ArrayMaxSize(1000)
  @IsInt({ each: true })
  staffIds: number[];
}
