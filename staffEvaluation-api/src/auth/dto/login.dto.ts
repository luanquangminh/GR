import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'user@example.com', description: 'User email address' })
  @IsEmail()
  @MaxLength(255)
  email: string;

  @ApiProperty({ example: 'Password123', description: 'User password', minLength: 1 })
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  password: string;
}
