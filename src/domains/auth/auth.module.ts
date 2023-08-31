import { Module } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { AuthController } from './auth.controller';
import { AuthRepository } from './repository/auth.repository';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './auth.guard';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: async (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, AuthRepository, JwtStrategy],
  controllers: [AuthController],
  exports: [],
})
export class AuthModule {}
