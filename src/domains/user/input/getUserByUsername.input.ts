import {IsNotEmpty, IsString} from "class-validator";

export class getUserByUsername {
    @IsNotEmpty()
    @IsString()
    username: string;
}