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
    Put, Query, ForbiddenException
} from '@nestjs/common';
import {IEventService} from './service';
import {Request as ExpressRequest} from 'express';
import {JwtAuthGuard} from '../auth/auth.guard';
import {
    answerInviteInput,
    getEventsBySearchInput,
    getGuestsByEventInput,
    inviteGuestInput,
    NewEventInput,
    updateEventInput
} from "./input";

@UseGuards(JwtAuthGuard)
@Controller('event')
export class EventController {
    constructor(private eventService: IEventService) {
    }

    @Get()
    getEvents(@Request() req: ExpressRequest) {
        return this.eventService.getEventsByUserId(req.user['id']);
    }

    @Get('search')
    getEventsByNameOrDescriptionAndUserId(
        @Request() req: ExpressRequest,
        @Query() search: getEventsBySearchInput,
    ) {
        console.log(search)
        return this.eventService.getEventsByNameOrDescriptionAndUserId(
            req.user['id'],
            search,
        );
    }

    @Post()
    createEvent(@Request() req: ExpressRequest, @Body() input: NewEventInput) {
        const date = new Date(input.date);
        const confirmationDeadline = new Date(input.confirmationDeadline);
        const today = new Date();
        if (date < today || confirmationDeadline < today) {
            throw new ForbiddenException("Both date and confirmation deadline must be in the future")
        } else if (date < confirmationDeadline) {
            throw new ForbiddenException("Confirmation deadline cannot be after the event date")
        }
        return this.eventService.createEvent(req.user['id'], input);
    }

    @Post('invite/send')
    inviteGuest(@Body() input: inviteGuestInput, @Request() req: ExpressRequest) {
        return this.eventService.inviteGuest(input, req.user['id']);
    }

    @Put('invite/answer')
    answerInvite(@Body() input: answerInviteInput, @Request() req: ExpressRequest) {
        return this.eventService.answerInvite(input, req.user['id']);
    }

    @Get('invites/by_user')
    getInvitesByUser(@Request() req: ExpressRequest) {
        return this.eventService.getInvitesByUser(req.user['id']);
    }

    @Get('invites/by_event')
    getGuestsByEvent(@Body() input: getGuestsByEventInput) {
        return this.eventService.getGuestsByEvent(input.eventId);
    }

    @Get(':eventId')
    getEvent(
        @Request() req: ExpressRequest,
        @Param('eventId') eventId: number,
    ) {
        return this.eventService.getEventById(req.user['id'], eventId);
    }

    @Post(':eventId')
    updateEvent(
        @Request() req: ExpressRequest,
        @Param('eventId') eventId: string,
        @Body() input: updateEventInput,
    ) {
        const eventIdInt = parseInt(eventId);
        if (Number.isNaN(eventIdInt)) {
            throw new TypeError('Event id must be a number');
        } 
        if (
            this.eventService.checkGuestStatusOnEvent(req.user['id'], eventIdInt)
        ) {
            return this.eventService.updateEvent(eventIdInt, input);
        } else throw new UnauthorizedException('User is not hosting this event');
    }

    @Delete(':eventId')
    deleteEvent(
        @Request() req: ExpressRequest,
        @Param('eventId') eventId: string,
    ) {
        const eventIdInt = parseInt(eventId);
        if (Number.isNaN(eventIdInt)) {
            throw new TypeError('Event id must be a number');
        }
        return this.eventService.deleteEvent(req.user['id'], eventIdInt);
    }
}
