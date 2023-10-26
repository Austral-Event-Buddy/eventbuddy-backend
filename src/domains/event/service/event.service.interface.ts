import {
  answerInviteInput,
  getEventsBySearchInput,
  inviteGuestInput,
  NewEventInput,
} from '../input';
import { updateEventInput } from '../input';
import { EventInfoOutputDto } from '../dto/event.info.output.dto';
import {EventDto} from "../dto/event.dto";
import {GuestDto} from "../dto/guest.dto";
import {ElementDto} from "../../element/dto/element.dto";


export abstract class IEventService {
  abstract createEvent(userId: number, input: NewEventInput): Promise<EventDto>;
  abstract getEventsByUserId(userId: number): Promise<EventInfoOutputDto[]>;
  abstract getEventById(userId: number, eventId: number): Promise<EventInfoOutputDto>;
  abstract getEventsByNameOrDescriptionAndUserId(
    userId: number,
    input: getEventsBySearchInput,
  ): Promise<EventInfoOutputDto[]>;

  abstract checkGuestStatusOnEvent(userId: number, eventId: number): Promise<boolean>;

  abstract updateEvent(eventId: number, input: updateEventInput): Promise<EventDto>;

  abstract deleteEvent(userId: number, eventId: number): Promise<boolean>;

  abstract inviteGuest(
    input: inviteGuestInput,
    userId: number,
  ): Promise<GuestDto>;

  abstract answerInvite(
    input: answerInviteInput,
    userId: number,
  ): Promise<GuestDto>;

  abstract getInvitesByUser(userId: number): Promise<
    GuestDto[]
  >;

  abstract getGuestsByEvent(eventId: number): Promise<
    GuestDto[]
  >;

	abstract getElementsByEvent(eventId: number) : Promise<ElementDto[]>
  abstract getEventByEventId(userId: number, eventId: number): Promise<EventDto>
}
