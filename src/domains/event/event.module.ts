import { Module } from '@nestjs/common';
import { EventController } from './event.controller';
import {EventService, IEventService} from './service';
import { EventRepository } from './repository/event.repository';
import {IEventRepository} from "./repository";

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
  ],
})
export class EventModule {}
