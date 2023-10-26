import {IsInt, IsNotEmpty} from "class-validator";

export class ElementInput{
	@IsInt()
	@IsNotEmpty()
	id: number;

	constructor(id: number) {
		this.id = id;
	}

}