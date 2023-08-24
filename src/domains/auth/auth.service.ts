import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
const bcrypt = require('bcrypt');
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import {LoginInput} from "./input";

@Injectable()
export class AuthService {
	constructor(private prisma: PrismaService) {}

	// async register(dto:){
	// 	bcrypt.hash(dto.password, 8, async (error, hash) => {
	// 		if(error) throw error;
	// 		try {
	// 			const user = this.prisma.user.create({
	// 				data: {
	// 					email: dto.email,
	// 					password: hash,
	// 					name: dto.name,
	// 				},
	// 			});
	// 		} catch (error) {
	// 			if (error instanceof PrismaClientKnownRequestError) {
	// 				if (error.code === 'P2002') {
	// 					throw new ForbiddenException('Credentials taken');
	// 				}
	// 			}
	// 			throw error;
	// 		}
	// 	});
	// }
	// async login(dto: LoginInput) {
	// 	const user = await this.prisma.user.findUnique({
	// 		where: {
	// 			email: dto.email,
	// 		},
	// 	});
	// 	if (!user) throw new ForbiddenException('Credentials incorrect');
	// 	const match = bcrypt.compare(dto.password, user.password);
	// 	if (!match) throw new ForbiddenException('Credentials incorrect');
	// 	return `credentials correct ${user.name}`;
	// }
}
