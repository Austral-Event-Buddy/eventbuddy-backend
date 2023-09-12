import { NewEventInput } from '../input';
import {
  Guest,
  Event,
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

  abstract getEvent(eventId: number): Promise<
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
    }>;

  abstract inviteGuest(
    eventId: number,
    invitedId: number,
  ): Promise<{
    id: number;
    userId: number;
    eventId: number;
    confirmationStatus: $Enums.confirmationStatus;
  }>;

  abstract answerInvite(
    guestId: number,
    answer: confirmationStatus,
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

  abstract getGuest(guestId: number): Promise<
    {
      id: number;
      userId: number;
      eventId: number;
      confirmationStatus: $Enums.confirmationStatus;
    }>;

  abstract getGuestsByEvent(eventId: number): Promise<
    {
      id: number;
      userId: number;
      eventId: number;
      confirmationStatus: $Enums.confirmationStatus;
    }[]>;
  abstract findConfirmationStatus(userId: number, eventId: number): Promise<confirmationStatus>;
  abstract countGuestsByEventId(eventId: number) : Promise<number>;
  abstract checkIfUserIsCreator(userId: number, eventId: number): Promise<Event>;
}
