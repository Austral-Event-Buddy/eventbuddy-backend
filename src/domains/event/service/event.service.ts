import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { getEventsBySearchInput, NewEventInput } from '../input';
import { IEventService } from './event.service.interface';
import { updateEventInput } from '../input';
import { Event } from '@prisma/client';
import { IEventRepository } from "../repository";

@Injectable()
export class EventService implements IEventService {
  constructor(private repository: IEventRepository) {}

  async getEventsByUserId(userId: number) {
    const events = await this.repository.getEventsByUserId(userId);
    if (!events) {
      throw new NotFoundException('No events found');
    }
    return this.toEventInfoOutput(events, userId);
  }

  async getEventsByNameOrDescriptionAndUserId(
    userId: number,
    input: getEventsBySearchInput,
  ) {
    const events = await this.repository.getEventsByNameOrDescriptionAndUserId(
      userId,
      input.search,
    );
    if (!events) {
      throw new NotFoundException('No events found');
    }
    return this.toEventInfoOutput(events, userId);
  }

  async createEvent(userId: number, input: NewEventInput) {
    return this.repository.createEvent(userId, input);
  }

  async checkGuestStatusOnEvent(userId: number, eventId: number) {
    const event = await this.repository.getHostGuest(userId, eventId);
    if (event === null) {
      throw new ForbiddenException('User is not hosting this event');
    } else return true;
  }

  async updateEvent(eventId: number, input: updateEventInput) {
    const event = await this.repository.updateEvent(eventId, input);
    if (event === null) {
      throw new NotFoundException('Event not found');
    }
    return event;
  }

  async deleteEvent(userId: number, eventId: number) {
    const event = await this.repository.checkIfUserIsCreator(userId, eventId);
    if (event === null) {
      throw new UnauthorizedException('User is not authorized to delete event');
    }
    await this.repository.deleteEventAndGuests(eventId);
    return true;
  }

  private async toEventInfoOutput(events: Event[], userId: number) {
    return Promise.all(
      events.map(async (event: Event) => {
        const confirmationStatus = await this.repository.findConfirmationStatus(
          userId,
          event.id,
        );
        const guestCount = await this.repository.countGuestsByEventId(event.id);
        return {
          name: event.name,
          description: event.description,
          coordinates: event.coordinates,
          date: event.date,
          confirmationDeadline: event.confirmationDeadline,
          confirmationStatus: confirmationStatus,
          guestCount: guestCount,
        };
      }),
    );
  }
}
