import {Body, Controller, Get, Request, UseGuards} from '@nestjs/common';
import {EventService} from './event.service';
import {AuthGuard} from "../auth/auth.guard";
import {getEventsBySearchInput} from "./input";
import {Request as ExpressRequest} from "express";

@Controller('event')
@UseGuards(AuthGuard)
export class EventController {
    constructor(private eventService: EventService) {
    }

    @Get('getEvents')
    getEvents(@Request() req: ExpressRequest) {
    }

    @Get('getEvents/search')
    getEventsByNameOrDescriptionAndUserId(@Body() req: getEventsBySearchInput) {
    }
}
