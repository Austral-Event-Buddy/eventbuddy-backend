import {Injectable} from "@nestjs/common";
import {IElementService} from "./element.service.interface";
import {NewElementInput} from "../input/newElementInput";

@Injectable()
export class ElementService implements IElementService {
	createEvent(){
		// TICK check if the event is in the future
		// check if the users id are host or confirmation
	}

	createElement(userId: number, input: NewElementInput): Promise<ElementDto> {

		return Promise.resolve(undefined);
	}
}