import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Request,
    UnauthorizedException,
    UseGuards,
} from '@nestjs/common';
import {EventService} from './service/event.service';
import {getEventsBySearchInput, NewEventInput} from './input';
import {Request as ExpressRequest} from 'express';
import {JwtAuthGuard} from '../auth/auth.guard';
import {updateEventInput} from './input/updateEvent.input';

@UseGuards(JwtAuthGuard)
@Controller('event')
export class EventController {
    constructor(private eventService: EventService) {
    }

    @Get('getEvents')
    getEvents(@Request() req: ExpressRequest) {
        return this.eventService.getEventsByUserId(req.user['id']);
    }

    @Get('getEvents/search')
    getEventsByNameOrDescriptionAndUserId(@Request() req: ExpressRequest, @Body() input: getEventsBySearchInput,) {
        return this.eventService.getEventsByNameOrDescriptionAndUserId(
            req.user['id'],
            input,
        );
    }

    @Post('createEvent')
    createEvent(@Request() req: ExpressRequest, @Body() input: NewEventInput) {
        return this.eventService.createEvent(req.user['id'], input);
    }

    @Post(':eventId')
    updateEvent(@Request() req: ExpressRequest, @Param('eventId') eventId: string, @Body() input: updateEventInput,) {
        const eventIdInt = parseInt(eventId);
        if (Number.isNaN(eventIdInt)) {
            throw new TypeError('Event id must be a number');
        } else {
            if (
                this.eventService.checkGuestStatusOnEvent(req.user['id'], eventIdInt)
            ) {
                return this.eventService.updateEvent(eventIdInt, input);
            } else throw new UnauthorizedException('User is not hosting this event');
        }
    }

    @Delete(':eventId')
    deleteEvent(@Request() req: ExpressRequest, @Param('eventId') eventId: string,) {
        const eventIdInt = parseInt(eventId);
        if (Number.isNaN(eventIdInt)) {
            throw new TypeError('Event id must be a number');
        } else {
            return this.eventService.deleteEvent(req.user['id'], eventIdInt);
        }
    }
}
