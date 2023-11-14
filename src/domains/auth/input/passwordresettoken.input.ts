import {IsDate, IsEmail, IsNotEmpty, IsNumber, IsString} from "class-validator";


export class PasswordResetTokenInput{
    constructor(token: string, userId: number, expirationDate: Date) {
        this.token = token;
        this.userId = userId;
        this.expirationDate = expirationDate;
    }

    @IsNotEmpty()
    @IsString()
    token: string;

    @IsNumber()
    @IsNotEmpty()
    userId: number;

    @IsDate()
    @IsNotEmpty()
    expirationDate: Date;
}