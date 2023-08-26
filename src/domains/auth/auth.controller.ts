import { Body, Controller, ForbiddenException, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {LoginInput, RegisterInput} from './input';

@Controller('auth')
export class AuthController {
	constructor(private service: AuthService) {}

	@Post('register')
	register(@Body() req: RegisterInput){
		return this.service.register(req);
	}
	@Post('login')
	login(@Body() req: LoginInput){
		if (!req.email && !req.password) throw new ForbiddenException('Incomplete credentials');
		return this.service.login(req);
	}
}
