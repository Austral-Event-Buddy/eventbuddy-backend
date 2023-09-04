import { Body, Controller, Post } from '@nestjs/common';
import { LoginInput, RegisterInput } from './input';
import {IAuthService} from "./service/auth.service.interface";

@Controller('auth')
export class AuthController {
  constructor(private service: IAuthService) {}

  @Post('register')
  register(@Body() req: RegisterInput) {
    return this.service.register(req);
  }

  @Post('login')
  login(@Body() req: LoginInput) {
    return this.service.login(req);
  }
}
