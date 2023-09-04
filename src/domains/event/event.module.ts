import { Module } from '@nestjs/common';
import { EventController } from './event.controller';
import { EventService } from './service';
import { EventRepository } from './repository/event.repository';
import { JwtStrategy } from '../auth/auth.guard';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth';
import { AuthRepository } from '../auth';

@Module({
  controllers: [EventController],
  providers: [
    EventService,
    EventRepository,
    JwtStrategy,
    ConfigService,
    AuthService,
    AuthRepository,
    JwtService,
  ],
})
export class EventModule {}
