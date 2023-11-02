import {UserDto} from "../../user/dto/user.dto";
import {ElementDto} from "./element.dto";
import {GetUserDto} from "../../user/dto/get.user.dto";

export class ElementExtendedDto extends ElementDto{
    users: GetUserDto[]
    isAssignedToUser?: boolean

    constructor(elementsExtendedDto: ElementExtendedDto) {
        super(elementsExtendedDto);
        this.users = elementsExtendedDto.users;
        this.isAssignedToUser = elementsExtendedDto.isAssignedToUser;
    }
}