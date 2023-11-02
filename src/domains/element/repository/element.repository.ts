import {Injectable} from "@nestjs/common";
import {IElementRepository} from "./element.repository.interface";
import {PrismaService} from "../../../prisma/prisma.service";
import {UserDto} from "../../user/dto/user.dto";
import {ElementDto} from "../dto/element.dto";
import {MaxUsersDto} from "../dto/maxUsersDto";
import {UpdateElementInput, NewElementInput} from "../input";

@Injectable()
export class ElementRepository implements IElementRepository {
	constructor(private prisma: PrismaService) {}
	createElement(input: NewElementInput): Promise<ElementDto> {
		return this.prisma.element.create({
			data: {
				eventId: input.eventId,
				maxUsers: input.maxUsers,
				name: input.name,
				quantity: input.quantity,
			},
		});
	}

	getUsers(elementId: number): Promise<UserDto[]> {
		return this.prisma.element.findUnique({ where: { id: elementId } })
			.users()
	}

	addUser(userId: number , elementId: number): Promise<ElementDto> {
		return this.prisma.element.update({
			where: {
				id: elementId
			},
			data: {
				users: {
					connect: {
						id: userId,
					},
				},
			},
		});
	}

	getElementById(elementId:number): Promise<ElementDto> {
		return this.prisma.element.findUnique({
			where: {id: elementId},
			include: {
				users: {
					select: {
						email: true,
						username: true,
						name: true,
					},
				}
			},
		})
	}

	deleteUser(userId: number, elementId: number): Promise<ElementDto> {
		return this.prisma.element.update({
			where: { id: elementId },
			data: {
				users: {
					disconnect: {
						id: userId,
					},
				},
			},
		});
	}
	getMaxUsers(elementId: number): Promise<MaxUsersDto> {
		return this.prisma.element.findUnique({
			where: {id: elementId},
			select: {maxUsers: true}
		})
	}

	updateElement(input: UpdateElementInput): Promise<ElementDto> {
		return this.prisma.element.update({
			where: {id: input.id},
			data: {
				name: input.name,
				eventId: input.eventId,
				quantity: input.quantity,
				maxUsers: input.maxUsers
			}
		})
	}

	async deleteElement(elementId: number) {
		await this.prisma.element.delete({
			where: {id: elementId}
		})
	}

}