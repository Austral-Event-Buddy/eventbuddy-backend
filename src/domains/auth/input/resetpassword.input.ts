import {IsNotEmpty, IsString} from "class-validator";

export class ResetPasswordInput{

    @IsNotEmpty()
    @IsString()
    token: string;

    @IsNotEmpty()
    @IsString()
    newPassword: string;
}