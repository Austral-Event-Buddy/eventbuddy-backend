import {
    Guest,
    Event,
    Prisma,
    $Enums,
    confirmationStatus,
} from '@prisma/client';

export class GuestDto{
    id: number;
    userId: number;
    eventId: number;
    confirmationStatus: confirmationStatus;
    isHost: boolean
    constructor(newGuest: GuestDto) {
        this.id = newGuest.id;
        this.userId = newGuest.userId;
        this.eventId = newGuest.eventId;
        this.confirmationStatus = newGuest.confirmationStatus;
        this.isHost = newGuest.isHost;
    }
}