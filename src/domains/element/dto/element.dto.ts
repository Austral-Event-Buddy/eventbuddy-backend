import {EventDto} from "../../event/dto/event.dto";
import {UserDto} from "../../user/dto/user.dto";

export class ElementDto {
	id: number
	name: string
	quantity: number
	eventId: number
	maxUsers: number

	constructor(elementDto: ElementDto) {
		this.id = elementDto.id;
		this.name = elementDto.name;
		this.quantity = elementDto.quantity;
		this.eventId = elementDto.eventId;
		this.maxUsers = elementDto.maxUsers;
	}
}