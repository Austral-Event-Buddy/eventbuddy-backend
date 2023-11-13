import {Body, Controller, Get, NotFoundException, Param, Post, Put} from '@nestjs/common';
import {LoginInput, RegisterInput, ResetPasswordInput} from './input';
import {IAuthService} from "./service/auth.service.interface";
import { TokenDto } from './dto/register.dto';
import {IsEmail} from "class-validator";
import {EmailValidator} from "./validator/email.validator";

@Controller('auth')
export class AuthController {
  constructor(private service: IAuthService) {}

  @Post('register')
  register(@Body() req: RegisterInput): Promise<TokenDto> {
    return this.service.register(req);
  }

  @Post('login')
  login(@Body() req: LoginInput): Promise<TokenDto> {
    return this.service.login(req);
  }

  @Post('send-reset-password-email/:email')
  async sendResetPasswordEmail(@Param() validator: EmailValidator) {
      await this.service.sendResetPasswordEmail(validator.email); //This return is ignored on purpose.
      return 'Reset password email sent!'
  }

  @Put('reset-password')
  async resetPassword(@Body() input: ResetPasswordInput) {
      await this.service.resetPassword(input); //This return is ignored on purpose.
      return "Password changed successfully"

  }
}
