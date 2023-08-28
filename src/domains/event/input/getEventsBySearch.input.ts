import {IsString} from "class-validator";

export class getEventsBySearchInput {
    @IsString()
    search: string
}