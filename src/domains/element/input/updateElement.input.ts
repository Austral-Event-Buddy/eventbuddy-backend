import {IsDateString, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString} from "class-validator";

export class UpdateElementInput{
	@IsInt()
	@IsNotEmpty()
	id: number;

	@IsString()
	@IsOptional()
	name: string;

	@IsInt()
	@IsPositive()
	@IsOptional()
	quantity: number;

	@IsInt()
	@IsPositive()
	@IsOptional()
	maxUsers: number;

	@IsInt()
	@IsOptional()
	eventId: number;
}