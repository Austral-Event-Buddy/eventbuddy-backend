import {IsDateString, IsInt, IsNotEmpty} from "class-validator";

export class NewReviewInput {
    @IsNotEmpty()
    @IsInt()
    eventId: number;

    @IsNotEmpty()
    @IsInt()
    rating: number;
    
    @IsNotEmpty()
    @IsDateString()
    date: Date;
}