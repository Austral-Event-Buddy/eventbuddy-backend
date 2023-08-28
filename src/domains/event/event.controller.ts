import {Body, Controller, Get, Request, UseGuards} from '@nestjs/common';
import {EventService} from './event.service';
import {getEventsBySearchInput} from "./input";
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


}
