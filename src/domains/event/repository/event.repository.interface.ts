import {getEventsBySearchInput, NewEventInput} from '../input';
import {Guest, Event, Prisma, $Enums, confirmationStatus} from '@prisma/client';
import {DefaultArgs} from "@prisma/client/runtime/library";

export interface IEventRepository {
  createEvent(userId: number, input: NewEventInput): Promise<Event>;

  getHostGuest(userId: number, eventId: number): Promise<Guest>;

  updateEvent(eventId: number, input: NewEventInput): Promise<Event>;

  // deleteEvent( eventId: number): Promise<Event>;
  getEventsByUserId(userId: number): Promise<Event[]>;

  getEventsByNameOrDescriptionAndUserId(
    userId: number,
    search: string,
  ): Promise<Event[]>;

  getEvent(eventId: number): Promise<Event>;

    inviteGuest(eventId: number, invitedId: number): Promise<Guest>;

    answerInvite(guestId: number, answer: confirmationStatus): Promise<Guest>;

    getInvitesByUser(userId: number): Promise<Guest[]>;

    getGuest(guestId: number): Promise<Guest>;

    getGuestsByEvent(eventId: number): Promise<Guest[]>;
}
