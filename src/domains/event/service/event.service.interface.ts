import {answerInviteInput, inviteGuestInput, NewEventInput} from '../input';
import {updateEventInput} from '../input/updateEvent.input';
import {$Enums, Prisma} from "@prisma/client";

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

    inviteGuest(input: inviteGuestInput, userId: number): Promise<{
        id: number;
        userId: number;
        eventId: number;
        confirmationStatus: $Enums.confirmationStatus;
    }>;

    answerInvite(input: answerInviteInput, userId: number): Promise<{
        id: number;
        userId: number;
        eventId: number;
        confirmationStatus: $Enums.confirmationStatus;
    }>;

    getInvitesByUser(userId: number): Promise<{
        id: number;
        userId: number;
        eventId: number;
        confirmationStatus: $Enums.confirmationStatus;
    }[]>;

    getGuestsByEvent(eventId: number): Prisma.PrismaPromise<{
        id: number;
        userId: number;
        eventId: number;
        confirmationStatus: $Enums.confirmationStatus;
    }[]>;
}
