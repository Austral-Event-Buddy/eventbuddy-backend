import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { HealthModule } from './domains/health/health.module';
import { AuthModule } from './domains/auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import {UserModule} from "./domains/user/user.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    HealthModule,
    AuthModule,
      UserModule,
  ],
})
export class AppModule {}
