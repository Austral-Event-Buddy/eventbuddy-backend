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
    Put, Query
} from '@nestjs/common';
import { IEventService } from './service';
import { Request as ExpressRequest } from 'express';
import { JwtAuthGuard } from '../auth/auth.guard';
import {answerInviteInput, getEventsBySearchInput, getGuestsByEventInput, inviteGuestInput, NewEventInput, updateEventInput} from "./input";

@UseGuards(JwtAuthGuard)
@Controller('event')
export class EventController {
  constructor(private eventService: IEventService) {}

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
    return this.eventService.createEvent(req.user['id'], input);
  }

  @Post('invite/send')
  inviteGuest(@Body() input: inviteGuestInput, @Request() req: ExpressRequest){
      return this.eventService.inviteGuest(input, req.user['id']);
  }

  @Put('invite/answer')
  answerInvite(@Body() input: answerInviteInput, @Request() req: ExpressRequest){
      return this.eventService.answerInvite(input, req.user['id']);
  }

  @Delete(':eventId')
  deleteEvent(
    @Request() req: ExpressRequest,
    @Param('eventId') eventId: string,
  ) {
    const eventIdInt = parseInt(eventId);
    if (Number.isNaN(eventIdInt)) {
      throw new TypeError('Event id must be a number');
    } else {
      return this.eventService.deleteEvent(req.user['id'], eventIdInt);
    }
  }
  
  @Get('invites/by_user')
  getInvitesByUser(@Request() req:ExpressRequest){
      return this.eventService.getInvitesByUser(req.user['id']);
  }

  @Get('invites/by_event')
  getGuestsByEvent(@Body() input: getGuestsByEventInput){
      return this.eventService.getGuestsByEvent(input.eventId);
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
      } else {
          if (
              this.eventService.checkGuestStatusOnEvent(req.user['id'], eventIdInt)
          ) {
              return this.eventService.updateEvent(eventIdInt, input);
          } else throw new UnauthorizedException('User is not hosting this event');
      }
  }
}
