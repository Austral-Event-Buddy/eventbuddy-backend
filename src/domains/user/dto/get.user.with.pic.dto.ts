import {GetUserDto} from "./get.user.dto";
import {UserDto} from "./user.dto";

export class GetUserWithPicDto extends GetUserDto {
    profilePictureUrl: string;
    constructor(userDto: UserDto, signedUrl: string) {
        super(userDto);
        this.profilePictureUrl = signedUrl;
    }
}