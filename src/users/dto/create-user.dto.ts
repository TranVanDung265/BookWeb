import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  fullName: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @IsOptional()
  phone?: string;

  @IsOptional()
  address?: string;
}
