import {ForbiddenException, Injectable} from "@nestjs/common";
import {IElementService} from "./element.service.interface";
import {IElementRepository} from "../repository/element.repository.interface";
import {UserDto} from "../../user/dto/user.dto";
import {ElementDto} from "../dto/element.dto";
import {ElementInput, UpdateElementInput, UserElementInput, NewElementInput} from "../input";

@Injectable()
export class ElementService implements IElementService {

	constructor(private repository: IElementRepository) {}

	createElement(input: NewElementInput): Promise<ElementDto> {
		return this.repository.createElement(input);
	}

	async addUser(userId: number, input: UserElementInput) {
		const users = await this.repository.getUsers(input.elementId);
		if(!this.checkUserInUsers(users, userId) && await this.checkUsersInElement(users.length, input.elementId)){
			const element = await this.repository.addUser(userId, input.elementId);
			if(element === null) throw new ForbiddenException("The element id is not vaid");
			return element;
		}
		throw new ForbiddenException("User is already in charge of this element");
	}

	async deleteUser(userId: number, input: UserElementInput) {
		const users = await this.repository.getUsers(input.elementId);
		if(this.checkUserInUsers(users, userId)){
			const element = await this.repository.deleteUser(userId, input.elementId);
			if(element === null) throw new ForbiddenException("The element id is not vaid");
			return element;
		}
		throw new ForbiddenException("User wasn't in charge of this element");
	}

	async updateElement(input: UpdateElementInput): Promise<ElementDto> {
		const element = await this.repository.updateElement(input);
		if(element === null) throw new ForbiddenException("The element id is not vaid");
		return element;
	}

	async deleteElement(input: ElementInput) {
		this.repository.deleteElement(input.id);
	}

	async getElementById(input: ElementInput): Promise<ElementDto> {
		const element = await this.repository.getElementById(input.id);
		if(element === null) throw new ForbiddenException("The element id is not vaid");
		return element;
	}

	private checkUserInUsers(users: UserDto[], userId: number) {
		users.forEach(user => {
			if(user.id === userId) { return true }
		});
		return false
	}

	private async checkUsersInElement(usersLen: number, elementId: number) {
		const maxUsers = await this.repository.getMaxUsers(elementId);
		return usersLen < maxUsers.maxUsers;
	}

}