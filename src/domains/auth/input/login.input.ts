import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class LoginInput {
  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsOptional()
  username: string;
}
