import {IsDateString, IsInt, IsNotEmpty} from "class-validator";

export class UserElementInput {
	@IsInt()
	@IsNotEmpty()
	elementId: number;

	@IsDateString()
	@IsNotEmpty()
	date: Date;
}