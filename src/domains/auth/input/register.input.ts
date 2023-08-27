import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RegisterInput {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsOptional()
  name: string;
}
