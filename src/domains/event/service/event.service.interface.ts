import {
  answerInviteInput,
  getEventsBySearchInput,
  inviteGuestInput,
  NewEventInput,
} from '../input';
import { updateEventInput } from '../input/updateEvent.input';
import { $Enums, Event, Guest, Prisma } from '@prisma/client';
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

  inviteGuest(input: inviteGuestInput, userId: number): Promise<Guest>;

    answerInvite(input: answerInviteInput, userId: number): Promise<Guest>;

    getInvitesByUser(userId: number): Promise<Guest[]>;

    getGuestsByEvent(eventId: number): Prisma.PrismaPromise<Guest[]>;
}
