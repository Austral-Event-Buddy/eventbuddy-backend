import {Injectable} from "@nestjs/common";
import {IEventRepository} from "../../../src/domains/event/repository";
import {NewEventInput} from "../../../src/domains/event/input";
import {Guest, Event, confirmationStatus, $Enums} from "@prisma/client";
import {EventDto} from "src/domains/event/dto/event.dto";
import { ElementDto } from "src/domains/element/dto/element.dto";
import { GuestDto } from "src/domains/event/dto/guest.dto";
import Any = jasmine.Any;
import {ElementExtendedDto} from "../../../src/domains/element/dto/element.extended.dto";
import {EventDto} from "../../../src/domains/event/dto/event.dto";

@Injectable()
export class EventRepositoryUtil implements IEventRepository {
    checkIfUserIsInvited(userId: number, eventId: number): Promise<GuestDto> {
        throw new Error("Method not implemented.");
    }
    getElementsByEvent(eventId: number): Promise<ElementExtendedDto[]> {
        throw new Error("Method not implemented.");
    }

    async getCommentReplies(event: EventDto): Promise<EventDto> {
        return event;
    }

    events: Event[] = [];
    guests: {
        id: number,
        userId: number,
        eventId: number,
        confirmationStatus: confirmationStatus,
        isHost: boolean,
        user: {username: string}
    }[] = [];
    id = 1;
    guestId = 1;

    getEventByEventId(eventId: number): Promise<Event> {
        for(const event of this.events){
            if (event.id === eventId){
                return Promise.resolve(event)
            }
        }
        return Promise.resolve(null)
    }

    createEvent(userId: number, input: NewEventInput): Promise<Event> {
        let event: Event = {
            id: this.id,
            name: input.name,
            description: input.description,
            creatorId: userId,
            coordinates: input.coordinates,
            confirmationDeadline: input.confirmationDeadline,
            createdAt: undefined,
            updatedAt: undefined,
            date: input.date,
        };
        const guest = {
            id: this.guestId++,
            userId: 1,
            eventId: this.id++,
            confirmationStatus: confirmationStatus.ATTENDING,
            isHost: true,
            user: {username: ""}
        };
        this.events.push(event);
        this.guests.push(guest);
        return Promise.resolve(event);
    }

    getEventsByUserId(userId: number): Promise<Event[]> {
        const eventsIds: number[] = [];
        for (let i = 0; i < this.guests.length; i++) {
            if (this.guests[i].userId === userId && this.guests[i].confirmationStatus !== "NOT_ATTENDING") eventsIds.push(this.guests[i].eventId);
        }
        const result = [];
        for (let i = 0; i < eventsIds.length; i++) {
            for (let j = 0; j < this.events.length; j++) {
                if (this.events[j].id === eventsIds[i]) result.push(this.events[j]);
            }
        }

        for (let i = 0; i < result.length; i++){
            result[i].guests = [];
            for (let j = 0; j < this.guests.length; j++){
                if (this.guests[j].eventId == result[i].id){
                    result[i].guests.push(this.guests[j]);
                }
            }
        }
        return Promise.resolve(result);
    }

    findConfirmationStatus(userId: number, eventId: number): Promise<confirmationStatus> {
        for (let i = 0; i < this.guests.length; i++) {
            if (this.guests[i].userId === userId && this.guests[i].eventId === eventId) {
                return Promise.resolve(this.guests[i].confirmationStatus)
            }
        }
        return undefined;
    }

    countGuestsByEventId(id: number): Promise<number> {
        let counter = 0;
        for (let i = 0; i < this.guests.length; i++) {
            if (this.guests[i].eventId === id &&
                (this.guests[i].confirmationStatus === 'ATTENDING')) counter++;
        }
        return Promise.resolve(counter);
    }

    async getEventsByNameOrDescriptionAndUserId(userId: number, search: string): Promise<Event[]> {
        const userEvents: Event[] = await this.getEventsByUserId(userId);
        const result = [];
        for (let i = 0; i < userEvents.length; i++) {
            if (userEvents[i].name.includes(search) || userEvents[i].description.includes(search)) result.push(userEvents[i]);
        }
        return Promise.resolve(result);
    }

    updateEvent(eventId: number, input: NewEventInput): Promise<Event> {
        for (const event of this.events) {
            if (event.id === eventId) {
                if (input.name) event.name = input.name;
                if (input.description) event.description = input.description;
                if (input.coordinates) event.coordinates = input.coordinates;
                if (input.date) event.date = input.date;
                if (input.confirmationDeadline) event.confirmationDeadline = input.confirmationDeadline;
                return Promise.resolve(event);
            }
        }
        return Promise.resolve(undefined);
    }

    checkIfUserIsCreator(userId: number, eventId: number): Promise<Event> {
        for (const event of this.events)
            if (event.id === eventId && event.creatorId === userId) return Promise.resolve(event);
        return Promise.resolve(null);
    }


    deleteEventAndGuests(eventId: number): any {
        const guestsResult = [];
        for (const guest of this.guests)
            if (guest.eventId !== eventId) guestsResult.push(guest);
        this.guests = guestsResult;
        const eventsResult = [];
        for (const event of this.events)
            if (event.id !== eventId) eventsResult.push(event);
        this.events = eventsResult;
    }

    getHostGuest(userId: number, eventId: number): Promise<Guest> {
        for (const guest of this.guests) {
            if (guest.eventId === eventId && guest.userId === userId && guest.isHost === true) return Promise.resolve(guest);
        }
        return Promise.resolve(undefined);
    }

    answerInvite(guestId: number, answer: confirmationStatus): Promise<{
        id: number;
        userId: number;
        eventId: number;
        confirmationStatus: $Enums.confirmationStatus
        isHost: boolean
    }> {
        for (const guest of this.guests) {
            if (guest.id === guestId) {
                guest.confirmationStatus = answer;
                return Promise.resolve({
                    id: guest.id,
                    userId: guest.userId,
                    eventId: guest.eventId,
                    confirmationStatus: guest.confirmationStatus,
                    isHost: guest.isHost
                });
            }
        }
    }

    getEvent(eventId: number): Promise<{
        id: number;
        name: string;
        description: string;
        creatorId: number;
        coordinates: number[];
        confirmationDeadline: Date;
        createdAt: Date;
        updatedAt: Date;
        date: Date
    }> {
        for (const event of this.events) {
            if (event.id === eventId) return Promise.resolve(event);
        }
        return Promise.resolve(undefined);
    }

    getGuest(guestId: number): Promise<{
        id: number;
        userId: number;
        eventId: number;
        confirmationStatus: $Enums.confirmationStatus
        isHost: boolean
    }> {
        for (const guest of this.guests) {
            if (guest.id === guestId) return Promise.resolve({
                id: guest.id,
                userId: guest.userId,
                eventId: guest.eventId,
                confirmationStatus: guest.confirmationStatus,
                isHost: guest.isHost
            });
        }
    }

    getGuestsByEvent(eventId: number): Promise<{
        id: number;
        userId: number;
        eventId: number;
        confirmationStatus: $Enums.confirmationStatus
        isHost: boolean
    }[]> {
        const result = [];
        for (const guest of this.guests) {
            if (guest.eventId === eventId) result.push(guest);
        }
        return Promise.resolve(result);
    }

    getInvitesByUser(userId: number): Promise<{
        id: number;
        userId: number;
        eventId: number;
        confirmationStatus: $Enums.confirmationStatus
        isHost: boolean
    }[]> {
        const result = [];
        for (const guest of this.guests) {
            if (guest.userId === userId) result.push(guest);
        }
        return Promise.resolve(result);
    }

    inviteGuest(eventId: number, invitedId: number, isHost: boolean): Promise<{
        id: number;
        userId: number;
        eventId: number;
        confirmationStatus: $Enums.confirmationStatus
        isHost: boolean
    }> {
        const guest = {
            id: this.guestId++,
            userId: invitedId,
            eventId: eventId,
            confirmationStatus: confirmationStatus.PENDING,
            isHost: isHost,
            user: {username: ""}
        }
        this.guests.push(guest);
        return Promise.resolve(guest);
    }
}

