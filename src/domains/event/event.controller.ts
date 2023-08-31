import {Body, Controller, Get, Post, Put, Request, UseGuards} from '@nestjs/common';
import {EventService} from './event.service';
import {answerInviteInput, getEventsBySearchInput, getGuestsByEventInput, inviteGuestInput} from "./input";
import {Request as ExpressRequest} from "express";
import {JwtAuthGuard} from "../auth/auth.guard";

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
    getEventsByNameOrDescriptionAndUserId(@Body() input: getEventsBySearchInput, @Request() req: ExpressRequest) {
        return this.eventService.getEventsByNameOrDescriptionAndUserId(input, req.user['id']);
    }

    @Post('inviteGuest')
    inviteGuest(@Body() input: inviteGuestInput, @Request() req: ExpressRequest){
        return this.eventService.inviteGuest(input, req.user['id']);
    }

    @Put('answerInvite')
    answerInvite(@Body() input: answerInviteInput, @Request() req: ExpressRequest){
        return this.eventService.answerInvite(input, req.user['id']);
    }

    @Get('getInvitesByUser')
    getInvitesByUser(@Request() req:ExpressRequest){
        return this.eventService.getInvitesByUser(req.user['id']);
    }

    @Get('getGuestsByEvent')
    getGuestsByEvent(input: getGuestsByEventInput){
        return this.eventService.getGuestsByEvent(input.eventId);
    }
}
