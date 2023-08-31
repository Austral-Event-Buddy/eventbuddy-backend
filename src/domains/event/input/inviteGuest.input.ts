import {IsNotEmpty, IsNumber} from "class-validator";

export class inviteGuestInput{
    @IsNotEmpty()
    @IsNumber()
    eventId: number;
    @IsNotEmpty()
    @IsNumber()
    guestId: number;
}