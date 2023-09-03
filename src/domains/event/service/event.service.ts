import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { EventRepository } from '../repository/event.repository';
import { getEventsBySearchInput, NewEventInput } from '../input';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { IEventService } from './event.service.interface';
import { updateEventInput } from '../input/updateEvent.input';
import { Event } from '@prisma/client';

@Injectable()
export class EventService implements IEventService {
  constructor(private repository: EventRepository) {}

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
    const event = this.repository.getHostGuest(userId, eventId);
    if (event === null) {
      throw new UnauthorizedException('User is not hosting this event');
    } else return true;
  }

  async updateEvent(eventId: number, input: updateEventInput) {
    const event = this.repository.updateEvent(eventId, input);
    if (event === null) {
      throw new NotFoundException('Event not found');
    } else return event;
  }

  async deleteEvent(userId: number, eventId: number) {
    const event = this.repository.checkIfUserIsCreator(userId, eventId);
    if (event === null) {
      throw new UnauthorizedException('User is not authorized to delete event');
    } else {
      try {
        const deletedEvent =
          await this.repository.deleteEventAndGuests(eventId);
        if (deletedEvent !== null) {
          return true;
        } else throw new NotFoundException('Event not found');
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === 'P2016') {
            throw new ForbiddenException(
              'User is not the creator of this event',
            );
          }
        }
        throw error;
      }
    }
  }

  private async toEventInfoOutput(events: Event, userId: number) {
    const eventInfoPromises = events.map(async (event: Event) => {
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
    });

    const eventInfo = await Promise.all(eventInfoPromises);
    return eventInfo;
  }
}
