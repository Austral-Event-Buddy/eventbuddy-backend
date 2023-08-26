import {ForbiddenException, Injectable} from "@nestjs/common";
import {User} from "@prisma/client";
import {PrismaService} from "../../prisma/prisma.service";
import {RegisterInput} from "./input";

@Injectable()
export class AuthRepository{
	constructor(private prisma: PrismaService) {}
	async findUserByEmail(email:string) : Promise<User> {
		const user = await this.prisma.user.findUnique({
			where: {
				email,
			},
		});
		if (!user) throw new ForbiddenException('Credentials incorrect');
		return user;
	}
	async findUserByUsername(username:string) : Promise<User> {
		const user = await this.prisma.user.findUnique({
			where: {
				username,
			},
		});
		if (!user) throw new ForbiddenException('User not found');
		return user;
	}
	async createUser(dto: RegisterInput, hash: string){
		const user = await this.prisma.user.create({
			data: {
				email: dto.email,
				password: hash,
				username: dto.username,
				name: dto.name,
			},
		});
		delete user.password;
		return user;

	}
}