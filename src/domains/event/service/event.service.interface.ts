import {
  answerInviteInput,
  getEventsBySearchInput,
  inviteGuestInput,
  NewEventInput,
} from '../input';
import { updateEventInput } from '../input/updateEvent.input';
import { $Enums, Prisma, Event } from '@prisma/client';
import { eventInfoOutputDto } from '../dto/eventInfoOutput.dto';

export abstract class IEventService {
  abstract createEvent(userId: number, input: NewEventInput): Promise<Event>;
  abstract getEventsByUserId(userId: number): Promise<eventInfoOutputDto[]>;
  abstract getEventsByNameOrDescriptionAndUserId(
    userId: number,
    input: getEventsBySearchInput,
  ): Promise<eventInfoOutputDto[]>;

  abstract checkGuestStatusOnEvent(userId: number, eventId: number): Promise<boolean>;

  abstract updateEvent(eventId: number, input: updateEventInput): Promise<Event>;

  abstract deleteEvent(userId: number, eventId: number): Promise<boolean>;

  abstract inviteGuest(
    input: inviteGuestInput,
    userId: number,
  ): Promise<{
    id: number;
    userId: number;
    eventId: number;
    confirmationStatus: $Enums.confirmationStatus;
  }>;

  abstract answerInvite(
    input: answerInviteInput,
    userId: number,
  ): Promise<{
    id: number;
    userId: number;
    eventId: number;
    confirmationStatus: $Enums.confirmationStatus;
  }>;

  abstract getInvitesByUser(userId: number): Promise<
    {
      id: number;
      userId: number;
      eventId: number;
      confirmationStatus: $Enums.confirmationStatus;
    }[]
  >;

  abstract getGuestsByEvent(eventId: number): Prisma.PrismaPromise<
    {
      id: number;
      userId: number;
      eventId: number;
      confirmationStatus: $Enums.confirmationStatus;
    }[]
  >;
}
