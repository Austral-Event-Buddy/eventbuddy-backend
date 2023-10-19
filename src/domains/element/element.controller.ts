import {Body, Controller, ForbiddenException, Post, Request} from "@nestjs/common";
import {Request as ExpressRequest} from "express";
import {NewElementInput} from "./input/newElementInput";
import {IElementService} from "./service/element.service.interface";
import {EventService} from "../event/service";

@Controller('element')
export class ElementController {

	constructor(private service: IElementService, private eventService: EventService) {}

	@Post()
	createElement(@Request() req: ExpressRequest, @Body() input: NewElementInput){
		if(!this.eventService.checkFutureEvent(input.eventId, input.date)) throw new ForbiddenException("The event id is not valid");
		for (const userId of input.usersIds) {
			const status = this.eventService.checkGuestStatusOnEvent()
			if(!this.eventService.)
		}
		else if(this.eventService.checkGuestStatusOnEvent())
		return this.service.createElement(req.user['id'], input)
	}
}