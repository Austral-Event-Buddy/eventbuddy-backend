import { Module } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { AuthController } from './auth.controller';
import { AuthRepository } from './repository/auth.repository';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './auth.guard';
import { IAuthService } from "./service/auth.service.interface";
import { IAuthRepository } from "./repository/auth.repository.interface";

const authServiceProvider = {
  provide: IAuthService,
  useClass: AuthService,
};
const authRepositoryProvider = {
  provide: IAuthRepository,
  useClass: AuthRepository,
};
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
  ],
  controllers: [AuthController],
  exports: [],
})
export class AuthModule {}
