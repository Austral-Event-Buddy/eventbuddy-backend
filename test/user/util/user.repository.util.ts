import {IUserRepository} from "../../../src/domains/user/repository/user.repository.interface";
import {UserDto} from "../../../src/domains/user/dto/user.dto";
import {UpdateUserInput} from "../../../src/domains/user/input/update.user.input";
import {RegisterInput} from "../../../src/domains/auth/input";
import {User} from "@prisma/client";
import * as bcrypt from "bcrypt";

export class UserRepositoryUtil implements IUserRepository {
     testUser:User = {
        id: 1,
        email: 'test@test.com',
        username: 'test',
        password: 'password',
        name: 'test',
        createdAt: undefined,
        updatedAt: undefined
    };
    users: User[] = [this.testUser];
    id = 1;

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

    deleteUser(userId: number): Promise<UserDto> {
        return Promise.resolve(undefined);
    }

    findUserById(userId: number): Promise<UserDto> {
        return Promise.resolve(undefined);
    }

    findUserByUsername(username: string): Promise<UserDto[]> {
        return Promise.resolve([]);
    }

    async updateUser(userId: number, input: UpdateUserInput): Promise<UserDto>{
        let user:User;
        for(let i=0; i<this.users.length; i++){
            if(this.users[i].id === userId){
                user = this.users[i];
            }
        }
        if(user){
            if(input.name){
                user.name = input.name
            }
            if(input.email){
                user.email = input.email
            }
            if(input.password){
                user.password = await bcrypt.hash(input.password, 8)
            }
        }

        return user
    }

}