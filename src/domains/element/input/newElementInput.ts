import {IsArray, IsDateString, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString} from "class-validator";

export class NewElementInput {
	@IsString()
	@IsNotEmpty()
	name: string;

	@IsInt()
	@IsPositive()
	@IsNotEmpty()
	quantity: number;

	@IsInt()
	@IsNotEmpty()
	eventId: number;

	@IsArray()
	@IsOptional()
	usersIds: number[];

	@IsNotEmpty()
	@IsDateString()
	date: Date;
}