import { IsString, IsOptional, IsInt, IsEmail, IsEnum, IsDateString, IsBoolean } from 'class-validator';
import { Gender } from '@prisma/client';

export class CreateStaffDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsEmail({}, { message: 'Please provide a valid home email address' })
  homeEmail?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Please provide a valid school email address' })
  schoolEmail?: string;

  @IsString()
  staffcode: string;

  @IsOptional()
  @IsEnum(Gender, { message: 'Gender must be either "male" or "female"' })
  gender?: Gender;

  @IsOptional()
  @IsDateString({}, { message: 'Birthday must be a valid ISO date string' })
  birthday?: string;

  @IsOptional()
  @IsString()
  mobile?: string;

  @IsOptional()
  @IsString()
  academicrank?: string;

  @IsOptional()
  @IsString()
  academicdegree?: string;

  @IsOptional()
  @IsString()
  position?: string;

  @IsOptional()
  @IsBoolean()
  isPartyMember?: boolean;

  @IsOptional()
  @IsInt()
  organizationunitid?: number;

  @IsOptional()
  @IsString()
  bidv?: string;
}

export class UpdateStaffDto extends CreateStaffDto { }
