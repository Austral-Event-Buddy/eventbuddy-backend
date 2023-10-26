import { Module } from '@nestjs/common';
import { EventController } from './event.controller';
import {EventService, IEventService} from './service';
import { EventRepository } from './repository/event.repository';
import {IEventRepository} from "./repository";
import { UserModule } from '../user/user.module';

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
  providers: [EventService,
    eventServiceProvider,
    eventRepositoryProvider,
  ],
  imports: [UserModule],
  exports: [EventService]
})
export class EventModule {}
