import {UpdateUserInput} from "../../../src/domains/user/input/update.user.input";
import {UserDto} from "../../../src/domains/user/dto/user.dto";
import {User} from "@prisma/client";
import * as bcrypt from "bcrypt";
import {UserRepositoryUtil} from "./user.repository.util";
import {RegisterInput} from "../../../src/domains/auth/input";

export class UserServiceUtil{
    userRepository = new UserRepositoryUtil()
  async notifyInvitation(userId: number, eventName: string){}

    async updateUser(userId: number, input: UpdateUserInput): Promise<UserDto>{
        return this.userRepository.updateUser(userId, input);
    }
}
