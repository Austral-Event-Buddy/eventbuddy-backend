import { NewEventInput } from '../input';
import { updateEventInput } from '../input/updateEvent.input';

export abstract class IEventService {
  abstract createEvent(
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

  abstract checkGuestStatusOnEvent(userId: number, eventId: number): Promise<boolean>;

  abstract updateEvent(
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

  abstract deleteEvent(userId: number, eventId: number): Promise<boolean>;
}
