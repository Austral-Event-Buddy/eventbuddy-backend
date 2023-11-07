import {IsEmail, IsNotEmpty, IsString} from "class-validator";

export class EmailValidator {
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string;
}