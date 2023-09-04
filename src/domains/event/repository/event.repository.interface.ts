import { NewEventInput } from '../input';
import { Guest, Event } from '@prisma/client';

export abstract class IEventRepository {
  abstract createEvent(userId: number, input: NewEventInput): Promise<Event>;
  abstract getHostGuest(userId: number, eventId: number): Promise<Guest>;
  abstract updateEvent(eventId: number, input: NewEventInput): Promise<Event>;
  // deleteEvent( eventId: number): Promise<Event>;
  // abstract getEventsByUserId(userId: number): Promise<{id: number, name: string, description: string, creatorId: number, coordinates: number[], confirmationDeadline: Date, createdAt: Date, updatedAt: Date, date: Date}[]>;
  abstract getEventsByUserId(userId: number): Promise<Event[]>;
  abstract getEventsByNameOrDescriptionAndUserId(
    userId: number,
    search: string,
  ): Promise<Event[]>;

  abstract countGuestsByEventId(id: number) : Promise<number>;

  abstract findConfirmationStatus(userId: number, id: number): Promise<{confirmationStatus: string}>;

  abstract checkIfUserIsCreator(userId: number, eventId: number) : Promise<{creatorId: number}>;

  abstract deleteEventAndGuests(eventId: number) : any ;
}
