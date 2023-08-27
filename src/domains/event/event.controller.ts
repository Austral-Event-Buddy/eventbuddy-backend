import {Controller, Get, Query} from '@nestjs/common';
import {EventService} from './event.service';

@Controller('event')
export class EventController {
    constructor(private eventService: EventService) {
    }

    @Get('getEvents')
    getEvents(@Query('userId')userId: number) {
        const numUserId = Number(userId)
        if (Number.isInteger(numUserId)) {
            return this.eventService.getEventsByUserId(numUserId)
        }
        else {
            throw new Error("Invalid user id")
        }


    }
    @Get('getEvents/search')
    getEventsByNameOrDescriptionAndUserId(@Query('input')input: string, @Query('userId')userId: number){
        const numUserId = Number(userId)
        if (Number.isInteger(numUserId)) {
            return this.eventService.getEventsByNameOrDescriptionAndUserId(input, numUserId)
        }
        else {
            throw new Error("Invalid user id")
        }
    }
}
