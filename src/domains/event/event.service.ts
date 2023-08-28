import { Injectable } from '@nestjs/common';
import { EventRepository } from './event.repository';
import {getEventsBySearchInput} from "./input";

@Injectable()
export class EventService {
  constructor(private repository: EventRepository) {}
    async getEventsByUserId(userId: number){
      return this.repository.getEventsByUserId(userId);
    }
    async getEventsByNameOrDescriptionAndUserId(input: getEventsBySearchInput, userId: number){
      return this.repository.getEventsByNameOrDescriptionAndUserId(input.search, userId);
    }
}
