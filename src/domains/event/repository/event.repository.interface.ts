import { getEventsBySearchInput, NewEventInput } from '../input';
import {
  Guest,
  Event,
  Prisma,
  $Enums,
  confirmationStatus,
} from '@prisma/client';

export abstract class IEventRepository {
  abstract createEvent(userId: number, input: NewEventInput): Promise<Event>;

  abstract getHostGuest(userId: number, eventId: number): Promise<Guest>;

  abstract updateEvent(eventId: number, input: NewEventInput): Promise<Event>;

  abstract deleteEventAndGuests( eventId: number): any;
  abstract getEventsByUserId(userId: number): Promise<Event[]>;

  abstract getEventsByNameOrDescriptionAndUserId(
    userId: number,
    search: string,
  ): Promise<Event[]>;

  abstract getEvent(eventId: number): Promise<Event>;

  abstract inviteGuest(eventId: number, invitedId: number): Promise<Guest>;

  abstract answerInvite(guestId: number, answer: confirmationStatus): Promise<Guest>;

  abstract getInvitesByUser(userId: number): Promise<Guest[]>;

  abstract getGuest(guestId: number): Promise<Guest>;

  abstract getGuestsByEvent(eventId: number): Promise<Guest[]>;

  abstract findConfirmationStatus(userId: number, eventId: number): Promise<confirmationStatus>;
  abstract countGuestsByEventId(eventId: number) : Promise<number>;
  abstract checkIfUserIsCreator(userId: number, eventId: number): Promise<Event>;
}
