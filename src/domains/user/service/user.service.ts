import {Inject, Injectable, NotFoundException} from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';
import { IUserService } from './user.service.inteface';
import { UpdateUserInput } from '../input/update.user.input';
import {IMailService} from "../../mail/service/mail.service.interface";
import {ConfigService} from "@nestjs/config";
import {UserDto} from "../dto/user.dto";

@Injectable()
export class UserService implements IUserService{
    constructor(
        private userRepository: UserRepository,
        @Inject('IMailService') private mailService: IMailService,
        private readonly config: ConfigService
    ) {}

    async getUserByUsername(username: string){
      const user = await this.userRepository.findUserByUsername(username);
      if(!user){
          throw new NotFoundException('User could not be found');
      }
      return user;
    }

    async updateUser(userId: number, input: UpdateUserInput){
      const user = await this.userRepository.updateUser(userId, input);
      if(!user){
          throw new NotFoundException('User could not be found');
      }
      return user;
    }

    async deleteUser(userId: number){
      const user = await this.userRepository.deleteUser(userId);
      if(!user){
          throw new NotFoundException('User could not be found');
      }
      return user;
  }

    async getUserById(userId: number): Promise<UserDto> {
        const user = await this.userRepository.findUserById(userId);
        if(!user){
            throw new NotFoundException('User could not be found');
        }
        return user;
    }

    async notifyInvitation(userId: number, eventName: string){
        const user = await this.userRepository.findUserById(userId)
        this.mailService.sendEmail(
            user.email,
            this.config.get("SENDGRID_INVITATION_TEMPLATE_ID"),
            {"URL" : this.config.get("FRONTEND_URL") + this.config.get("FRONTED_INVITATIONS_PATH") || ""}
        )
    }
}
