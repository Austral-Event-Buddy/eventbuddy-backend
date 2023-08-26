import {ForbiddenException, Injectable} from '@nestjs/common';
import {PrismaService} from '../../prisma/prisma.service';
import {PrismaClientKnownRequestError} from '@prisma/client/runtime/library';
import {LoginInput, RegisterInput} from "./input";
import {AuthRepository} from "./auth.repository";

const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
	constructor(private prisma: PrismaService, private repo: AuthRepository) {}

	async register(dto: RegisterInput){
		try {
			if(!dto.name) dto.name = '';
			const hash = await bcrypt.hash(dto.password, 8);
			return this.repo.createUser(dto, hash);
		} catch (error) {
			if (error instanceof PrismaClientKnownRequestError) {
				if (error.code === 'P2002') {
					throw new ForbiddenException('Credentials taken');
				}
			}
			throw error;
		}
	}
	async login(dto: LoginInput) {
		let user;
		if(dto.username) user = await this.repo.findUserByUsername(dto.username);
		else if (dto.email) user = await this.repo.findUserByEmail(dto.email);
		else throw new ForbiddenException('Incomplete credentials');

		const match = bcrypt.compare(dto.password, user.password);
		if (!match) throw new ForbiddenException('Credentials incorrect');
		return `credentials correct ${user.name}`;
	}
}
