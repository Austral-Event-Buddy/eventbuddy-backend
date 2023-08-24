import { Body, Controller, ForbiddenException, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";

@Controller('api/auth')
export class AuthController {
	constructor(private service: AuthService) {}

	@Post('register')
	register(@Body() req: AuthDto){
		if (!req.name && !req.email && !req.password) throw new ForbiddenException('Incomplete credentials');
		return this.service.register(req);
	}
	@Post('login')
	login(@Body() req: AuthDto){
		if (!req.email && !req.password) throw new ForbiddenException('Incomplete credentials');
		return this.service.login(req);
	}
}
