import { getEventsBySearchInput, NewEventInput } from '../input';
import { Guest, Event } from '@prisma/client';

export interface IEventRepository {
  createEvent(userId: number, input: NewEventInput): Promise<Event>;
  getHostGuest(userId: number, eventId: number): Promise<Guest>;
  updateEvent(eventId: number, input: NewEventInput): Promise<Event>;
  // deleteEvent( eventId: number): Promise<Event>;
  getEventsByUserId(userId: number): Promise<
    {
      id: number;
      name: string;
      description: string;
      coordinates: number[];
      confirmationDeadline: Date;
      date: Date;
    }[]
  >;
  getEventsByNameOrDescriptionAndUserId(
    userId: number,
    search: string,
  ): Promise<
    {
      id: number;
      name: string;
      description: string;
      coordinates: number[];
      confirmationDeadline: Date;
      date: Date;
    }[]
  >;
}
