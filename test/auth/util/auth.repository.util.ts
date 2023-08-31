import { Injectable } from '@nestjs/common';
import {IAuthRepository} from "../../../src/domains/auth";
import {RegisterInput} from "../../../src/domains/auth/input";
import {User} from "@prisma/client";

@Injectable()
export class UtilAuthRepository implements IAuthRepository {
	users: User[] = [];
	id= 1;

	async createUser(dto: RegisterInput) {
		const user = {
			id: this.id++,
			email: dto.email,
			password: dto.password,
			username: dto.username,
			name: dto.name,
			createdAt: undefined,
			updatedAt: undefined,
		}
		this.users.push(user);
		return user;
	}

	findUserByEmail(email: string): Promise<User> {
		for(let i=0; i<this.users.length; i++){
			if(this.users[i].email === email){
				return Promise.resolve(this.users[i]);
			}
		}
		return undefined;
	}

	findUserById(userId: number): Promise<User> {
		for(let i=0; i<this.users.length; i++){
			if(this.users[i].id === userId){
				return Promise.resolve(this.users[i]);
			}
		}
		return undefined;
	}

	findUserByUsername(username: string): Promise<User> {
		for(let i=0; i<this.users.length; i++){
			if(this.users[i].username === username){
				return Promise.resolve(this.users[i]);
			}
		}
		return undefined;
	}
}