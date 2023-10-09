import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import {UserService} from "./user.service";
import {UserRepository} from "./user.repository";
import { MailModule } from '../mail/mail.module';

@Module({
  controllers: [UserController],
  providers: [UserService, UserRepository],
  imports: [MailModule],
  exports: [UserService]
})
export class UserModule {}
