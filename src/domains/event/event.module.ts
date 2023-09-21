import { Module } from '@nestjs/common';
import { EventController } from './event.controller';
import {EventService, IEventService} from './service';
import { EventRepository } from './repository/event.repository';
import {IEventRepository} from "./repository";
import {UserRepository} from "../user/user.repository";

const eventServiceProvider = {
  provide: IEventService,
  useClass: EventService,
};

const eventRepositoryProvider = {
  provide: IEventRepository,
  useClass: EventRepository,
};

@Module({
  controllers: [EventController],
  providers: [
    eventServiceProvider,
    eventRepositoryProvider,
    UserRepository
  ],
})
export class EventModule {}
