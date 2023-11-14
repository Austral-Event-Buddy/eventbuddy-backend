import { Injectable } from '@nestjs/common';
import { IAuthRepository } from '../../../src/domains/auth';
import { PasswordResetTokenInput, RegisterInput} from '../../../src/domains/auth/input';
import {PasswordResetToken, User} from '@prisma/client';
import {UpdateUserInput} from "../../../src/domains/user/input/update.user.input";
import {UserDto} from "../../../src/domains/user/dto/user.dto";
import * as bcrypt from 'bcrypt';


@Injectable()
export class UtilAuthRepository implements IAuthRepository {
	users: User[] = [];
    passwordResetTokens: PasswordResetToken[] = []
	id= 1;

	async createUser(dto: RegisterInput) {
		const user = {
			id: this.id++,
			email: dto.email,
			password: dto.password,
			username: dto.username,
			name: dto.name,
			defaultPic: false,
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
    async createPasswordResetToken(dto: PasswordResetTokenInput): Promise<PasswordResetTokenInput> {
        const passwordResetToken = {
            token: dto.token,
            userId: dto.userId,
            expirationDate: dto.expirationDate
        }
        this.passwordResetTokens.push(<PasswordResetToken>passwordResetToken);
        return Promise.resolve(passwordResetToken)
    }
    async findPasswordResetTokenByToken(token: string): Promise<PasswordResetTokenInput> {
        for(let i=0; i<this.passwordResetTokens.length; i++){
            if(this.passwordResetTokens[i].token === token){
                return Promise.resolve(this.passwordResetTokens[i]);
            }
        }
        return undefined;
    }
}