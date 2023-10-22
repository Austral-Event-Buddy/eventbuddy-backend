import {NewElementInput, UpdateElementInput} from "../input";
import {UserDto} from "../../user/dto/user.dto";
import {ElementDto} from "../dto/element.dto";
import {MaxUsersDto} from "../dto/maxUsersDto";

export abstract class IElementRepository{
	abstract createElement(input: NewElementInput): Promise<ElementDto>;

	abstract getUsers(elementId: number): Promise<UserDto[]>;

	abstract addUser(userId: number, elementId: number): Promise<ElementDto>;

	abstract deleteUser(userId: number, elementId: number): Promise<ElementDto> ;

	abstract getElementById(elementId:number): Promise<ElementDto>;

	abstract getMaxUsers(elementId: number): Promise<MaxUsersDto>

	abstract updateElement(input: UpdateElementInput) : Promise<ElementDto>;

	abstract deleteElement(elementId: number) ;
}