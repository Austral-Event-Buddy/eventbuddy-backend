import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { EventRepository } from '../repository/event.repository';
import {
  answerInviteInput,
  getEventsBySearchInput,
  inviteGuestInput,
  NewEventInput,
} from '../input';
import { IEventService } from './event.service.interface';
import { updateEventInput } from '../input';
import { Event } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { eventInfoOutputDto } from '../dto/eventInfoOutput.dto';

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

  private async toEventInfoOutput(
    events: Event[],
    userId: number,
  ): Promise<eventInfoOutputDto[]> {
    let eventInfoOutput: eventInfoOutputDto[] = [];
    for (const event of events) {
      const confirmationStatus = await this.repository.findConfirmationStatus(
        userId,
        event.id,
      );
      const guestCount = await this.repository.countGuestsByEventId(event.id);
      eventInfoOutput.push({
        id: event.id,
        name: event.name,
        description: event.description,
        coordinates: event.coordinates,
        date: event.date,
        confirmationDeadline: event.confirmationDeadline,
        confirmationStatus: confirmationStatus,
        guests: guestCount,
      });
    }
    return eventInfoOutput;
  }

  async inviteGuest(input: inviteGuestInput, userId: number) {
    const eventId = input.eventId;
    const invitedId = input.userId;
    const hostGuest = await this.repository.getHostGuest(eventId, userId);
    const creator = await this.repository.getEvent(eventId).creator();
    if (hostGuest != null || creator['id'] === userId) {
      try {
        return await this.repository.inviteGuest(eventId, invitedId);
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === 'P2002') {
            throw new ForbiddenException(
              'The user is already invited to this event',
            );
          }
        }
      }
    } else {
      throw new ForbiddenException('You are not a host of this event'); //Didnt work
    }
  }

  async answerInvite(input: answerInviteInput, userId: number) {
    const guestId = input.guestId;
    const guest = await this.repository.getGuest(guestId);
    console.log();
        if (guest.userId == userId) {
      return await this.repository.answerInvite(guestId, input.answer);
    } else {
      throw new ForbiddenException('This invite is not yours');
    }
  }

  async getInvitesByUser(userId: number) {
    return this.repository.getInvitesByUser(userId);
  }

  getGuestsByEvent(eventId: number) {
    return this.repository.getGuestsByEvent(eventId);
  }
}
