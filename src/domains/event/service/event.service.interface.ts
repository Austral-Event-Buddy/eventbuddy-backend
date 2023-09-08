import {
  answerInviteInput,
  getEventsBySearchInput,
  inviteGuestInput,
  NewEventInput,
} from '../input';
import { updateEventInput } from '../input/updateEvent.input';
import { $Enums, Prisma, Event } from '@prisma/client';
import { eventInfoOutputDto } from '../dto/eventInfoOutput.dto';

export interface IEventService {
  createEvent(userId: number, input: NewEventInput): Promise<Event>;
  getEventsByUserId(userId: number): Promise<eventInfoOutputDto[]>;
  getEventsByNameOrDescriptionAndUserId(
    userId: number,
    input: getEventsBySearchInput,
  ): Promise<eventInfoOutputDto[]>;

  checkGuestStatusOnEvent(userId: number, eventId: number): Promise<boolean>;

  updateEvent(eventId: number, input: updateEventInput): Promise<Event>;

  deleteEvent(userId: number, eventId: number): Promise<boolean>;

  inviteGuest(
    input: inviteGuestInput,
    userId: number,
  ): Promise<{
    id: number;
    userId: number;
    eventId: number;
    confirmationStatus: $Enums.confirmationStatus;
  }>;

  answerInvite(
    input: answerInviteInput,
    userId: number,
  ): Promise<{
    id: number;
    userId: number;
    eventId: number;
    confirmationStatus: $Enums.confirmationStatus;
  }>;

  getInvitesByUser(userId: number): Promise<
    {
      id: number;
      userId: number;
      eventId: number;
      confirmationStatus: $Enums.confirmationStatus;
    }[]
  >;

  getGuestsByEvent(eventId: number): Prisma.PrismaPromise<
    {
      id: number;
      userId: number;
      eventId: number;
      confirmationStatus: $Enums.confirmationStatus;
    }[]
  >;
}
