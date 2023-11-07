import { Module } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { AuthController } from './auth.controller';
import { AuthRepository } from './repository/auth.repository';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './auth.guard';
import { IAuthService } from "./service/auth.service.interface";
import { IAuthRepository } from "./repository/auth.repository.interface";
import {SendgridMailService} from "../mail/service/sendgrid.mail.service";
import {UserService} from "../user/service/user.service";
import {UserRepository} from "../user/repository/user.repository";

const authServiceProvider = {
  provide: IAuthService,
  useClass: AuthService,
};
const authRepositoryProvider = {
  provide: IAuthRepository,
  useClass: AuthRepository,
};
const mailServiceProvider = {
    provide: 'IMailService',
    useClass: SendgridMailService
}

const userServiceProvider = {
    provide: 'IUserService',
    useClass: UserService
}
const userRepositoryProvider = {
    provide: 'IUserRepository',
    useClass: UserRepository
}
@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: async (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
      ],
  providers: [
    authServiceProvider,
    authRepositoryProvider,
    JwtStrategy,
      mailServiceProvider,
      userServiceProvider,
      userRepositoryProvider,
      UserRepository
  ],
  controllers: [AuthController],
  exports: [],
})
export class AuthModule {}
