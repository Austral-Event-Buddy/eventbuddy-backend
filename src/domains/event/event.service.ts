import { Injectable } from '@nestjs/common';
import { EventRepository } from './event.repository';

@Injectable()
export class EventService {
  constructor(private repository: EventRepository) {}
    async getEventsByUserId(userId: number){
      return this.repository.getEventsByUserId(userId);
    }
    async getEventsByNameOrDescriptionAndUserId(input: string, userId: number){
      return this.repository.getEventsByNameOrDescriptionAndUserId(input, userId);
    }
}
