import { Global, Injectable } from '@nestjs/common';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './service/auth.service';

@Global()
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

@Global()
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    private readonly service: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    return this.service.findUserById(payload.sub);
  }
}
