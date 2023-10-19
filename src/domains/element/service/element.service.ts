import {Injectable} from "@nestjs/common";
import {IElementService} from "./element.service.interface";
import {NewElementInput} from "../input/newElementInput";
import {IElementRepository} from "../repository/element.repository.interface";

@Injectable()
export class ElementService implements IElementService {

	constructor(private repository: IElementRepository) {}

	createElement(input: NewElementInput): Promise<ElementDto> {
		return this.repository.createElement(input);
	}

}