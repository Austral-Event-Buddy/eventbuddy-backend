import {
  answerInviteInput,
  getEventsBySearchInput,
  inviteGuestInput,
  NewEventInput,
} from '../input';
import { updateEventInput } from '../input';
import { Event, Guest } from '@prisma/client';
import { eventInfoOutputDto } from '../dto/eventInfoOutput.dto';

export abstract class IEventService {
  abstract createEvent(userId: number, input: NewEventInput): Promise<Event>;
  abstract getEventsByUserId(userId: number): Promise<eventInfoOutputDto[]>;
  abstract getEventsByNameOrDescriptionAndUserId(
    userId: number,
    input: getEventsBySearchInput,
  ): Promise<eventInfoOutputDto[]>;

  abstract checkGuestStatusOnEvent(userId: number, eventId: number): Promise<boolean>;

  abstract updateEvent(eventId: number, input: updateEventInput): Promise<Event>;

  abstract deleteEvent(userId: number, eventId: number): Promise<boolean>;

  abstract inviteGuest(input: inviteGuestInput, userId: number): Promise<Guest>;

  abstract answerInvite(input: answerInviteInput, userId: number): Promise<Guest>;

  abstract getInvitesByUser(userId: number): Promise<Guest[]>;

  abstract getGuestsByEvent(eventId: number): Promise<Guest[]>;
}
