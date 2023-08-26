import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './domains/health/health.module';
import { AuthModule } from './domains/auth/auth.module';
import {UserModule} from "./domains/user/user.module";

@Module({
  imports: [HealthModule, AuthModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
