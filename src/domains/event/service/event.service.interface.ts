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
import {ElementExtendedDto} from "../../element/dto/element.extended.dto";
import {EventHostStatusDto} from "../dto/event.host.status.dto";


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
  abstract getEventByEventId(userId: number, eventId: number): Promise<EventHostStatusDto>
    abstract getElementsByEvent(eventId: number, userId: number) : Promise<ElementExtendedDto[]>

}
