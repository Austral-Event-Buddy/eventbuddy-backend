import {IsInt, IsNotEmpty} from "class-validator";

export class UpdateReviewInput{
    @IsNotEmpty()
    @IsInt()
    rating:number;
}