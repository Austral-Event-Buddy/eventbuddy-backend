import {ForbiddenException, Injectable} from '@nestjs/common';
import { EventRepository } from './event.repository';
import {answerInviteInput, getEventsBySearchInput, inviteGuestInput} from "./input";
import {PrismaClientKnownRequestError} from "@prisma/client/runtime/library";

@Injectable()
export class EventService {
  constructor(private repository: EventRepository) {}
    async getEventsByUserId(userId: number){
      return this.repository.getEventsByUserId(userId);
    }
    async getEventsByNameOrDescriptionAndUserId(input: getEventsBySearchInput, userId: number){
      return this.repository.getEventsByNameOrDescriptionAndUserId(input.search, userId);
    }

    //Check if userId is host of the event (?)
    async inviteGuest(input: inviteGuestInput, userId: number) {
      const eventId = input.eventId;
      const invitedId = input.userId;
      const hostGuest = await this.repository.getHostGuest(eventId, userId);
      const creator = await this.repository.getEvent(eventId).creator();
      if(hostGuest != null || creator['id'] === userId){
          try{
              return await this.repository.inviteGuest(eventId, invitedId);
          }
          catch (error) {
              if (error instanceof PrismaClientKnownRequestError) {
                  if (error.code === 'P2002') {
                      throw new ForbiddenException('The user is already invited to this event');
                  }
              }
          }
      }else{
        throw new ForbiddenException('You are not a host of this event'); //Didnt work
    }
  }


    async answerInvite(input: answerInviteInput, userId: number) {
        const guestId = input.guestId;
        const guest = await this.repository.getGuest(guestId);
        if(guest['userId'] == userId){
            return await this.repository.answerInvite(guestId, input.answer);
        }else{
            throw new ForbiddenException('This invite is not yours');
        }
  }

    async getInvitesByUser(userId: number) {
        return this.repository.getInvitesByUser(userId);
    }

    getGuestsByEvent(eventId: number) {
        return this.repository.getGuestsByEvent(eventId);
    }
}
