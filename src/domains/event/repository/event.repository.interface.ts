import { NewEventInput } from '../input';
import {
  confirmationStatus,
} from '@prisma/client';
import {EventDto} from "../dto/event.dto";
import {GuestDto} from "../dto/guest.dto";
import {ElementDto} from "../../element/dto/element.dto";

export abstract class IEventRepository {
  abstract createEvent(userId: number, input: NewEventInput): Promise<EventDto>;

  abstract getHostGuest(userId: number, eventId: number): Promise<GuestDto>;

  abstract updateEvent(eventId: number, input: NewEventInput): Promise<EventDto>;

  abstract deleteEventAndGuests( eventId: number): any;
  abstract getEventsByUserId(userId: number): Promise<EventDto[]>;

  abstract getEventsByNameOrDescriptionAndUserId(
    userId: number,
    search: string,
  ): Promise<EventDto[]>;

  abstract getEvent(eventId: number): Promise<
    EventDto>;

  abstract inviteGuest(
    eventId: number,
    invitedId: number,
    isHost: boolean,
  ): Promise<GuestDto>;

  abstract answerInvite(
    guestId: number,
    answer: confirmationStatus,
  ): Promise<GuestDto>;

  abstract getInvitesByUser(userId: number): Promise<
   GuestDto[]
  >;

  abstract getGuest(userId: number, eventId: number): Promise<
    GuestDto>;

  abstract getGuestsByEvent(eventId: number): Promise<
    GuestDto[]>;

  abstract findConfirmationStatus(userId: number, eventId: number): Promise<confirmationStatus>;
  
  abstract countGuestsByEventId(eventId: number) : Promise<number>;
  abstract checkIfUserIsCreator(userId: number, eventId: number): Promise<EventDto>;

	abstract getElementsByEvent(eventId: number) : Promise<ElementDto[]> ;
}
