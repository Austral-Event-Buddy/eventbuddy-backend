import { getEventsBySearchInput, NewEventInput } from '../input';
import {
  Guest,
  Event,
  Prisma,
  $Enums,
  confirmationStatus,
} from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';

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

  getEvent(eventId: number): Prisma.Prisma__EventClient<
    {
      id: number;
      name: string;
      description: string;
      creatorId: number;
      coordinates: number[];
      confirmationDeadline: Date;
      createdAt: Date;
      updatedAt: Date;
      date: Date;
    },
    null,
    DefaultArgs
  >;

  inviteGuest(
    eventId: number,
    invitedId: number,
  ): Promise<{
    id: number;
    userId: number;
    eventId: number;
    confirmationStatus: $Enums.confirmationStatus;
  }>;

  answerInvite(
    guestId: number,
    answer: confirmationStatus,
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

  getGuest(guestId: number): Prisma.Prisma__GuestClient<
    {
      id: number;
      userId: number;
      eventId: number;
      confirmationStatus: $Enums.confirmationStatus;
    },
    null,
    DefaultArgs
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
