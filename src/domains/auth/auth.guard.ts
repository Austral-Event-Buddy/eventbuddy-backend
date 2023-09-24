import { Global, Injectable } from '@nestjs/common';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import {IAuthService} from "./service/auth.service.interface";
import { UserDto } from '../user/dto/user.dto';

@Global()
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

@Global()
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    private readonly service: IAuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  async validate(payload: any): Promise<UserDto>{
    return this.service.findUserById(payload.sub);
  }
}
