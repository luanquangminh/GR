import { IsString, IsOptional, IsInt, IsEmail, IsEnum, IsDateString, IsBoolean, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { Gender } from '@prisma/client';
import { PartialType, ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

const TrimString = () => Transform(({ value }) => typeof value === 'string' ? value.trim() : value);

export class CreateStaffDto {
  @ApiProperty({ example: 'Nguyễn Văn A', description: 'Staff full name' })
  @IsString()
  @MaxLength(200)
  @TrimString()
  name: string;

  @ApiPropertyOptional({ example: 'nguyenvana@gmail.com', description: 'Personal email' })
  @IsOptional()
  @IsEmail({}, { message: 'Please provide a valid home email address' })
  @TrimString()
  homeEmail?: string;

  @ApiPropertyOptional({ example: 'nguyenvana@hust.edu.vn', description: 'School email' })
  @IsOptional()
  @IsEmail({}, { message: 'Please provide a valid school email address' })
  @TrimString()
  schoolEmail?: string;

  @ApiProperty({ example: 'GV001', description: 'Unique staff code' })
  @IsString()
  @MaxLength(50)
  @TrimString()
  staffcode: string;

  @ApiPropertyOptional({ enum: ['male', 'female'], description: 'Gender' })
  @IsOptional()
  @IsEnum(Gender, { message: 'Gender must be either "male" or "female"' })
  gender?: Gender;

  @ApiPropertyOptional({ example: '1990-01-15', description: 'Date of birth (ISO format)' })
  @IsOptional()
  @IsDateString({}, { message: 'Birthday must be a valid ISO date string' })
  birthday?: string;

  @ApiPropertyOptional({ example: '0912345678', description: 'Mobile phone number' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  @TrimString()
  mobile?: string;

  @ApiPropertyOptional({ example: 'PGS', description: 'Academic rank (PGS, GS, etc.)' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  @TrimString()
  academicrank?: string;

  @ApiPropertyOptional({ example: 'TS', description: 'Academic degree (ThS, TS, etc.)' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  @TrimString()
  academicdegree?: string;

  @ApiPropertyOptional({ example: 'Trưởng bộ môn', description: 'Position' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  @TrimString()
  position?: string;

  @ApiPropertyOptional({ example: false, description: 'Is party member' })
  @IsOptional()
  @IsBoolean()
  isPartyMember?: boolean;

  @ApiPropertyOptional({ example: 1, description: 'Organization unit ID' })
  @IsOptional()
  @IsInt()
  organizationunitid?: number;

  @ApiPropertyOptional({ example: '1234567890', description: 'BIDV bank account' })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  @TrimString()
  bidv?: string;
}

export class UpdateStaffDto extends PartialType(CreateStaffDto) { }
