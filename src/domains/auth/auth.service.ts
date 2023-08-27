import {ForbiddenException, Injectable} from '@nestjs/common';
import {PrismaClientKnownRequestError} from '@prisma/client/runtime/library';
import {LoginInput, RegisterInput} from "./input";
import {AuthRepository} from "./auth.repository";
import {JwtService} from "@nestjs/jwt";

const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
	constructor(private repo: AuthRepository, private jwt: JwtService) {
	}

	async register(dto: RegisterInput) {
		try {
			if (!dto.name) dto.name = '';
			const hash = await bcrypt.hash(dto.password, 8);
			const user = await this.repo.createUser(dto, hash);
			return this.signToken(user.id);
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
		if (dto.username) user = await this.repo.findUserByUsername(dto.username);
		else if (dto.email) user = await this.repo.findUserByEmail(dto.email);
		else throw new ForbiddenException('Incomplete credentials');

		const match = bcrypt.compare(dto.password, user.password);
		if (!match) throw new ForbiddenException('Credentials incorrect');
		return this.signToken(user.id);
	}

	async signToken(userId: number): Promise<{ access_token: string }> {
		const data = {
			id: userId,
		};
		const token = await this.jwt.signAsync(data, {});
		return {
			access_token: token,
		};
	}
}
