import { Body, Controller, Post } from '@nestjs/common';
import { LoginInput, RegisterInput } from './input';
import {IAuthService} from "./service/auth.service.interface";
import { TokenDto } from './dto/register.dto';

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
}
