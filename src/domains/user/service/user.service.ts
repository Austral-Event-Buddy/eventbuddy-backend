import {forwardRef, Inject, Injectable, NotFoundException} from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';
import { IUserService } from './user.service.inteface';
import { UpdateUserInput } from '../input/update.user.input';
import {IMailService} from "../../mail/service/mail.service.interface";
import {ConfigService} from "@nestjs/config";
import {UserDto} from "../dto/user.dto";
import {AuthService, IAuthService} from "../../auth";
import {IS3Service} from "../../s3/service/s3.service.interface";
import {GetUserWithPicDto} from "../dto/get.user.with.pic.dto";
import {GetUserDto} from "../dto/get.user.dto";

@Injectable()
export class UserService implements IUserService{
    constructor(
        private userRepository: UserRepository,
        @Inject('IMailService') private mailService: IMailService,
        private readonly config: ConfigService,
        @Inject(forwardRef(() => IAuthService)) private readonly authService: IAuthService,
        private readonly s3Service: IS3Service
    ) {}

    async getUserByUsername(username: string): Promise<GetUserWithPicDto[]>{
      const user = await this.userRepository.findUserByUsername(username);
      if(!user){
          throw new NotFoundException('User could not be found');
      }
      return this.addProfilePictureToUsers(user);
    }

    async updateUser(userId: number, input: UpdateUserInput){
      input.password = await this.authService.encryptPassword(input.password);
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

    async getUserById(userId: number): Promise<GetUserWithPicDto> {
        const user = await this.userRepository.findUserById(userId);
        if(!user){
            throw new NotFoundException('User could not be found');
        }
        return this.addProfilePictureToUser(user);
    }

    async notifyInvitation(userId: number, eventName: string){
        const user = await this.userRepository.findUserById(userId)
        this.mailService.sendEmail(
            user.email,
            this.config.get("SENDGRID_INVITATION_TEMPLATE_ID"),
            {"URL" : this.config.get("FRONTEND_URL") + this.config.get("FRONTED_INVITATIONS_PATH") || ""}
        )
    }

    async uploadProfilePicture(userId: number): Promise<string>{
        await this.userRepository.updateUser(userId, {defaultPic: false})

        return this.s3Service.uploadFile(`${userId}`)
    }

    async getProfilePicture(userId: number, defaultPic: boolean): Promise<string>{
        if(defaultPic) return this.s3Service.getSignedUrl(this.config.get("DEFAULT_PROFILE_PICTURE"))

        return this.s3Service.getSignedUrl(`${userId}`)
    }

    async getProfilePictureById(userId: number): Promise<string>{
        const user = await this.userRepository.findUserById(userId)
        if(!user){
            throw new NotFoundException('User could not be found');
        }
        return this.getProfilePicture(userId, user.defaultPic)
    }

    async deleteProfilePicture(userId: number): Promise<void>{
        await this.userRepository.updateUser(userId, {defaultPic: true})

        return this.s3Service.deleteFile(`${userId}`)
    }

    private async addProfilePictureToUsers(users:UserDto[]): Promise<GetUserWithPicDto[]>{
        const result = []
        for (let i = 0; i < users.length; i++) {
            result[i] = new GetUserWithPicDto(
                users[i],
                await this.getProfilePicture(users[i].id, users[i].defaultPic)
            )
        }
        return result;
    }

    private async addProfilePictureToUser(user:UserDto): Promise<GetUserWithPicDto>{
        return new GetUserWithPicDto(
            user,
            await this.getProfilePicture(user.id, user.defaultPic)
        )
    }
}
