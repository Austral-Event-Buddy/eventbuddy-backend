import {IsArray, IsInt, IsNotEmpty, IsOptional, IsString} from "class-validator";

export class NewElementInput {
	@IsString()
	@IsNotEmpty()
	name: string;

	@IsInt()
	@IsNotEmpty()
	quantity: number;

	@IsInt()
	@IsNotEmpty()
	eventId: number;

	@IsArray()
	@IsOptional()
	usersIds: number[]
}