import {
	Body,
	Controller,
	Post,
	Request,
	UseGuards,
	ForbiddenException, Put, Delete, Get, Param
} from '@nestjs/common';
import {Request as ExpressRequest} from "express";
import {ElementInput, NewElementInput, UserElementInput, UpdateElementInput} from "./input";
import {IElementService} from "./service/element.service.interface";
import {EventService} from "../event/service";
import {JwtAuthGuard} from '../auth/auth.guard';
import {ElementDto} from "./dto/element.dto";

@UseGuards(JwtAuthGuard)
@Controller('element')
export class ElementController {

	constructor(private service: IElementService, private eventService: EventService) {}

	@Post()
	async createElement(@Request() req: ExpressRequest, @Body() input: NewElementInput): Promise<ElementDto>{
		if(!await this.eventService.checkGuestStatusOnEvent(req.user['id'], input.eventId)) throw new ForbiddenException("Only hosts can add elements to event");
		return this.service.createElement(input)
	}


	@Put('charge/take')
	async addUser(@Request() req: ExpressRequest, @Body() input: UserElementInput): Promise<ElementDto>{
		const eventId = await this.getEventId(new ElementInput(input.elementId));
		if(!await this.eventService.checkFutureEvent(eventId, input.date)) throw new ForbiddenException("The event has to be in the future");
		else if(!await this.checkGuestOrHost(eventId, req.user['id'])) throw new ForbiddenException("You can't take charge of the element if you are not a " +
																														"guest or if you have rejected the event")
		return this.service.addUser(req.user['id'], input)

	}

	@Put('charge/delete')
	async deleteUser(@Request() req: ExpressRequest, @Body() input: UserElementInput): Promise<ElementDto>{
		const eventId = await this.getEventId(new ElementInput(input.elementId));
		if(!await this.eventService.checkFutureEvent(eventId, input.date)) throw new ForbiddenException("The event has to be in the future");
		return this.service.deleteUser(req.user['id'], input)

	}

	@Put()
	async updateElement(@Request() req: ExpressRequest, @Body() input: UpdateElementInput){
		const eventId = await this.getEventId(new ElementInput(input.id));
		if(await this.eventService.checkGuestStatusOnEvent(req.user['id'], eventId)) return this.service.updateElement(input);
	}

	@Delete('/:elementId')
	async deleteElement(@Request() req: ExpressRequest, @Param('elementId') id: string){
		const eventId = await this.getEventId({ id: parseInt(id) });
		if(!await this.eventService.checkGuestStatusOnEvent(req.user['id'], eventId)) throw new ForbiddenException("User is not authorized to delete the element")
		await this.service.deleteElement({ id: parseInt(id) });
	}

	@Get(':elementId')
	getElement(@Param('elementId') id: string): Promise<ElementDto> {
		const elementId = parseInt(id);
		if (Number.isNaN(elementId)) {
			throw new ForbiddenException('Element id must be a number');
		} else { return this.service.getElementById(new ElementInput(elementId));}

	}


	private async checkGuestOrHost(eventId: number, userId: number): Promise<boolean>{
		try {
			if(await this.eventService.checkGuestStatusOnEvent(userId, eventId)) return true
		}
		catch (ForbiddenException){
			return await this.checkGuest(eventId, userId)
		}
	}

	private async checkGuest(eventId: number, userId: number): Promise<boolean>{
		const events = await this.eventService.getEventsByUserId(userId)
		for (const event of events) {
			if(event.id === eventId && event.confirmationStatus !== "NOT_ATTENDING") return true
		}
		return false
	}

	private async getEventId(elementId: ElementInput): Promise<number>{
		const element = await this.service.getElementById(elementId)
		return element.eventId;
	}
}