import {getEventsBySearchInput, NewEventInput} from '../input';
import {updateEventInput} from '../input';
import {Event} from "@prisma/client";

export abstract class IEventService {
    abstract getEventsByUserId(userId: number): Promise<{
        name: string,
        description: string,
        coordinates: number[],
        date: Date,
        confirmationDeadline: Date,
        confirmationStatus: { confirmationStatus: string },
        guestCount: number
    }[]>;
    abstract getEventsByNameOrDescriptionAndUserId(
        userId: number,
        input: getEventsBySearchInput,
    ):Promise<{
        name: string,
        description: string,
        coordinates: number[],
        date: Date,
        confirmationDeadline: Date,
        confirmationStatus: { confirmationStatus: string },
        guestCount: number
    }[]>;

    abstract createEvent(
        userId: number,
        input: NewEventInput,
    ): Promise<Event>;

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
    // abstract toEventInfoOutput(events: Event[], userId: number): Promise<{name: string, description: string, coordinates: number[], date: Date, confirmationDeadline: Date, confirmationStatus: {confirmationStatus: string}, guestCount: number}[]>;
}
