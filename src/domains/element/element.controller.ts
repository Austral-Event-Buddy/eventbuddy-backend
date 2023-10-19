import {Body, Controller, ForbiddenException, Post, Request} from "@nestjs/common";
import {Request as ExpressRequest} from "express";
import {NewElementInput} from "./input/newElementInput";
import {IElementService} from "./service/element.service.interface";
import {EventService} from "../event/service";

@Controller('element')
export class ElementController {

	constructor(private service: IElementService, private eventService: EventService) {}

	// cambiar esto a que solo reciba cantidad max de personas, cantidad de elementos y nombre
	@Post()
	async createElement(@Request() req: ExpressRequest, @Body() input: NewElementInput): Promise<ElementDto>{
		if(!await this.eventService.checkFutureEvent(input.eventId, input.date)) throw new ForbiddenException("The event id is not valid");
		// hacer que solo los host puedan agregar elementos a un elemento
		return this.service.createElement(input)
	}

	// TO-DO: hacer que cualquier persona host o confirmada se pueda hacer cargo del elemento
	// TO-DO: hacer que haya una cantidad limite de elementos
	// TO-DO: hacer que la persona se pueda hacer cargo del elemento o bajarse
	// TO-DO: solo un host puede updatear y eliminarlo

}