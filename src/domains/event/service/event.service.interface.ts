import { getEventsBySearchInput, NewEventInput } from '../input';
import { updateEventInput } from '../input/updateEvent.input';
import { Event } from '@prisma/client';

export interface IEventService {
  createEvent(
    userId: number,
    input: NewEventInput,
  ): Promise<{
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

  checkGuestStatusOnEvent(userId: number, eventId: number): Promise<boolean>;

  updateEvent(
    eventId: number,
    input: updateEventInput,
  ): Promise<{
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

  deleteEvent(userId: number, eventId: number): Promise<boolean>;
}
