import {IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";

export class NewCommentInput{
    @IsString()
    @IsNotEmpty()
    text: string;

    @IsNumber()
    @IsNotEmpty()
    eventId: number;

    @IsNumber()
    @IsOptional()
    parentId: number;


}