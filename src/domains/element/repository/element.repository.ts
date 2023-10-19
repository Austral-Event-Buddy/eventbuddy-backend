import {Injectable} from "@nestjs/common";
import {IElementRepository} from "./element.repository.interface";
import {NewElementInput} from "../input/newElementInput";
import {PrismaService} from "../../../prisma/prisma.service";

@Injectable()
export class ElementRepository implements IElementRepository {
	constructor(private prisma: PrismaService) {}
	createElement(input: NewElementInput): Promise<ElementDto> {
		return this.prisma.element.create({
			data: {
				name: input.name,
				quantity: input.quantity,
				eventId: input.eventId,
				users: {
					connect: input.usersIds.map(userId => ({id: userId})),
				},
			},
		});
	}

}