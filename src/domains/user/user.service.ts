import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { IMailService } from '../mail/service/mail.service.interface';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    @Inject('IMailService') private mailService: IMailService
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
      'You have been invited to an event',
      `You have been invited to ${eventName}. Check the invitation in your feed.`
      )
  }
}
