import {
    ForbiddenException,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import {
    answerInviteInput,
    getEventsBySearchInput,
    inviteGuestInput,
    NewEventInput,
} from '../input';
import {IEventService} from './event.service.interface';
import {updateEventInput} from '../input';
import {Event} from '@prisma/client';
import {IEventRepository} from "../repository";
import {PrismaClientKnownRequestError} from '@prisma/client/runtime/library';
import {EventInfoOutputDto} from '../dto/event.info.output.dto';
import {EventDto} from "../dto/event.dto";
import {ElementDto} from "../../element/dto/element.dto";
import { UserService } from '../../user/service/user.service';
import {ElementExtendedDto} from "../../element/dto/element.extended.dto";
import {EventHostStatusDto} from "../dto/event.host.status.dto";
import e from "express";

@Injectable()
export class EventService implements IEventService {
    constructor(private repository: IEventRepository,
                private userService: UserService
    ) {}

    async getEventsByUserId(userId: number) {
        const events = await this.checkEvents(await this.repository.getEventsByUserId(userId), userId);
        if (!events) {
            throw new NotFoundException('No events found');
        }
        return this.toEventInfoOutput(events, userId);
    }

    async getEventById(userId: number, eventId: number) {
        const invited = await this.repository.checkIfUserIsInvited(userId, eventId);
        if (!invited) {
            throw new NotFoundException('No event found');
        }
        const event = await this.repository.getEvent(eventId);
        return this.toEventInfoOutput([event], userId).then(res => res[0]);
    }

    async getEventsByNameOrDescriptionAndUserId(
        userId: number,
        input: getEventsBySearchInput,
    ) {
        const events = await this.repository.getEventsByNameOrDescriptionAndUserId(
            userId,
            input.search,
        );
        if (!events) {
            throw new NotFoundException('No events found');
        }
        // const finalEvents = await this.checkEvents(events, userId);
        return this.toEventInfoOutput(events, userId);
    }

    async getEventByEventId(userId: number, eventId: number):Promise<EventHostStatusDto> {
        const guest = await this.repository.getGuest(userId, eventId)
        if (guest !== undefined) {
            if (guest.confirmationStatus !== "NOT_ATTENDING") {
                const event = await this.repository.getEvent(eventId)
                return {
                    id: event.id,
                    name: event.name,
                    description: event.description,
                    creatorId : event.creatorId,
                    coordinates: event.coordinates,
                    date: event.date,
                    confirmationDeadline: event.confirmationDeadline,
                    updatedAt: event.updatedAt,
                    createdAt: event.createdAt,
                    isHost: guest.isHost
                }
            }
        } else throw new UnauthorizedException("User is not allowed to check this event information")
    }

    async createEvent(userId: number, input: NewEventInput) {
        return this.repository.createEvent(userId, input);
    }

    async checkGuestStatusOnEvent(userId: number, eventId: number) {
        const event = await this.repository.getHostGuest(userId, eventId);
        if (event === null) {
            throw new ForbiddenException('User is not hosting this event');
        } else return true;
    }

    async updateEvent(eventId: number, input: updateEventInput): Promise<EventDto> {
        const event = await this.repository.updateEvent(eventId, input);
        if (event === null) {
            throw new NotFoundException('Event not found');
        }
        return {
            id: event.id,
            name: event.name,
            description: event.description,
            creatorId: event.creatorId,
            coordinates: event.coordinates,
            confirmationDeadline: event.confirmationDeadline,
            date: event.date,
            updatedAt: event.updatedAt,
            createdAt: event.createdAt
        }
    }

    async deleteEvent(userId: number, eventId: number) {
        const event = await this.repository.checkIfUserIsCreator(userId, eventId);
        if (event === null) {
            throw new UnauthorizedException('User is not authorized to delete event');
        }
        await this.repository.deleteEventAndGuests(eventId);
        return true;
    }

    async inviteGuest(input: inviteGuestInput, userId: number) {
        const eventId = input.eventId;
        const invitedId = input.userId;
        const hostGuest = await this.repository.getHostGuest(userId, eventId);
        const event = await this.repository.getEvent(eventId);
        if (hostGuest != null || event.creatorId === userId) {
            if (!this.checkEventDate(event.date)) throw new ForbiddenException("The event date has passed")
            else if (!this.checkEventDate(event.confirmationDeadline)) throw new ForbiddenException("The confirmation deadline has passed")
            try {
                await this.userService.notifyInvitation(invitedId, event.name)
                return await this.repository.inviteGuest(eventId, invitedId, input.isHost);
            } catch (error) {
                if (error instanceof PrismaClientKnownRequestError) {
                    if (error.code === 'P2002') {
                        throw new ForbiddenException(
                            'The user is already invited to this event',
                        );
                    }
                }
            }
        } else {
            throw new ForbiddenException('You are not a host of this event');
        }
    }

    async answerInvite(input: answerInviteInput, userId: number) {
        const eventId = input.eventId;
        const guest = await this.repository.getGuest(userId, eventId);
        const event = await this.repository.getEvent(eventId);
        if (!this.checkEventDate(event.date))
            throw new ForbiddenException("The confirmation deadline has passed");
        else if (!await this.checkConfirmationDeadline(event.confirmationDeadline, guest.userId, event.id))
            throw new ForbiddenException("The confirmation deadline has passed");
        if (guest['userId'] == userId) {
            return await this.repository.answerInvite(guest.id, input.answer);
        } else {
            throw new ForbiddenException('This invite is not yours');
        }
    }

    async getInvitesByUser(userId: number) {
        return this.repository.getInvitesByUser(userId);
    }

    getGuestsByEvent(eventId: number) {
        return this.repository.getGuestsByEvent(eventId);
    }

    async getElementsByEvent(eventId: number, userId: number): Promise<ElementExtendedDto[]> {
        const result = await this.repository.getElementsByEvent(eventId);
        result.map(element => {
            element.isAssignedToUser = this.isUserInElement(userId, element);
        })
        return result;
    }

    private isUserInElement(userId: number, element: ElementExtendedDto): boolean {
        return element.users.some(user => user.id === userId)
    }

    async checkFutureEvent(eventId: number, date: Date) {
        const event: EventDto = await this.repository.getEvent(eventId)
        return new Date(event.date) >= new Date(date)
    }

    private async toEventInfoOutput(
        events: any[],
        userId: number,
    ): Promise<EventInfoOutputDto[]> {
        let eventInfoOutput: EventInfoOutputDto[] = [];
        for (const event of events) {
            const confirmationStatus = await this.repository.findConfirmationStatus(
                userId,
                event.id,
            );
            eventInfoOutput.push({
                id: event.id,
                name: event.name,
                description: event.description,
                coordinates: event.coordinates,
                date: event.date,
                confirmationDeadline: event.confirmationDeadline,
                confirmationStatus: confirmationStatus,
                guests: event.guests.map(guest => {
                    return {
                        id: guest.userId,
                        username: guest.user.username,
                        name: guest.user.name,
                        confirmationStatus: guest.confirmationStatus,
                    }
                }),
            })
        }
        return eventInfoOutput;
    }

    private async checkEvents(events: Event[], userId: number): Promise<Event[]> {
        const result: Event[] = [];
        for (const event of events)
            if (this.checkEventDate(event.date) && await this.checkConfirmationDeadline(event.confirmationDeadline, userId, event.id))
                result.push(event);
        return result;
    }

    private checkEventDate(dateEvent: Date): boolean {
        return dateEvent >= new Date();
    }

    private async checkConfirmationDeadline(dateEvent: Date, userId: number, eventId: number): Promise<boolean> {
        const confirmationStatus = await this.repository.findConfirmationStatus(userId, eventId);
        if (confirmationStatus === "PENDING") return dateEvent >= new Date();
        return true;
    }
}