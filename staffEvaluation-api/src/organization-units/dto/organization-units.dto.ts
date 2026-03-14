import { IsString, IsInt, IsOptional } from 'class-validator';

export class CreateOrganizationUnitDto {
  @IsInt()
  @IsOptional()
  id?: number;

  @IsString()
  name: string;
}

export class UpdateOrganizationUnitDto {
  @IsString()
  name: string;
}
