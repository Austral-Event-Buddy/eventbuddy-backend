import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {HealthModule} from "./domains/health/health.module";
import { EventModule } from './domains/event/event.module';

@Module({
  imports: [HealthModule, EventModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
