import { IsString, IsInt, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LinkStaffDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'Profile UUID' })
  @IsUUID()
  profileId: string;

  @ApiProperty({ example: 1, description: 'Staff ID to link' })
  @IsInt()
  staffId: number;
}

export class AddRoleDto {
  @ApiProperty({ example: 'moderator', enum: ['admin', 'moderator', 'user'], description: 'Role to assign' })
  @IsString()
  role: 'admin' | 'moderator' | 'user';
}
