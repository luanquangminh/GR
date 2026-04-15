import { IsEmail, IsString, MinLength, MaxLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com', description: 'Email address for registration' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @MaxLength(255)
  email: string;

  @ApiProperty({
    example: 'Password123',
    description: 'Password (min 8 chars, must contain uppercase, lowercase, and number)',
    minLength: 8,
  })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
  })
  password: string;
}
