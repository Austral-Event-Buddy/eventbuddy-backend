import { Injectable } from '@nestjs/common';
import { EventRepository } from './event.repository';
import {answerInviteInput, getEventsBySearchInput, inviteGuestInput} from "./input";
import {confirmationStatus} from "@prisma/client";

@Injectable()
export class EventService {
  constructor(private repository: EventRepository) {}
    async getEventsByUserId(userId: number){
      return this.repository.getEventsByUserId(userId);
    }
    async getEventsByNameOrDescriptionAndUserId(input: getEventsBySearchInput, userId: number){
      return this.repository.getEventsByNameOrDescriptionAndUserId(input.search, userId);
    }

    //Check if userId is the owner of event (?)
    async inviteGuest(input: inviteGuestInput, userId: number) {
        return await this.repository.inviteGuest(input.eventId, input.guestId, userId);
    }

    //Check if userId is the same as the guest userId (?)

    async answerInvite(input: answerInviteInput, userId: number) {
        return await this.repository.answerInvite(input.guestId, input.answer, userId);
    }

    async getInvites(userId: number) {
        return this.repository.getInvites(userId);
    }
}
