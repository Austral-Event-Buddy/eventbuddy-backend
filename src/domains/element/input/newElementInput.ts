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
	@IsPositive()
	@IsNotEmpty()
	maxUsers: number;

	@IsInt()
	@IsNotEmpty()
	eventId: number;

	@IsNotEmpty()
	@IsDateString()
	date: Date;
}