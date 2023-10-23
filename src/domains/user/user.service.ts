import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { IMailService } from '../mail/service/mail.service.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
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

  async notifyInvitation(userId: number, eventName: string){
    const user = await this.userRepository.findUserById(userId)
    this.mailService.sendEmail(
        user.email,
        this.config.get("SENDGRID_INVITATION_TEMPLATE_ID"),
        {"URL" : this.config.get("FRONTEND_URL") + this.config.get("FRONTED_INVITATIONS_PATH") || ""}
    )
  }
}
