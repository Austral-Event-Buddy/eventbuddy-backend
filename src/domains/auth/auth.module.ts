import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { Constants } from '../../utils';
import {AuthService} from "./auth.service";
import {AuthController} from "./auth.controller";
import {AuthRepository} from "./auth.repository";

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: Constants.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    })
  ],
  providers: [AuthService, AuthRepository],
  controllers: [AuthController],
})
export class AuthModule {}
