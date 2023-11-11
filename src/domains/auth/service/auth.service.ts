import {ForbiddenException, Inject, Injectable, NotFoundException} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import {PrismaClientKnownRequestError} from '@prisma/client/runtime/library';

import {LoginInput, PasswordResetTokenInput, RegisterInput, ResetPasswordInput} from '../input';
import {IAuthService} from "./auth.service.interface";
import {IAuthRepository} from "../repository/auth.repository.interface";
import {UserDto} from '../../user/dto/user.dto';
import {IMailService} from "../../mail/service/mail.service.interface";
import {ConfigService} from '@nestjs/config';
import {IUserService} from "../../user/service/user.service.inteface";
import {UpdateUserInput} from "../../user/input/update.user.input";


@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private repository: IAuthRepository,
    private jwt: JwtService,
    @Inject('IMailService') private mailService: IMailService,
    private config: ConfigService,
   @Inject('IUserService') private userService: IUserService
  ) {}

  async register(dto: RegisterInput) {
    try {
      dto.password = await bcrypt.hash(dto.password, 8);
      const user = await this.repository.createUser(dto);
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
    let user: UserDto;
    if (dto.username) {
      user = await this.repository.findUserByUsername(dto.username);
    } else if (dto.email) {
      user = await this.repository.findUserByEmail(dto.email);
    } else {
      throw new ForbiddenException('Incomplete credentials');
    }

    const match = bcrypt.compare(dto.password, user.password);
    if (!match) {
      throw new ForbiddenException('Credentials incorrect');
    }

    return this.signToken(user.id);
  }

  async findUserById(userId: number): Promise<UserDto> {
    try {
      return this.repository.findUserById(userId);
    } catch (_) {
      return null;
    }
  }

  async signToken(userId: number): Promise<{ access_token: string }> {
    return {
      access_token: await this.jwt.signAsync({ sub: userId }, {}),
    };
  }

  async sendResetPasswordEmail(email: string):Promise<string>{
      const user = await this.repository.findUserByEmail(email);
      if(!user){
          throw new NotFoundException('No account associated with email: ' + email)
      }
      const userId = user['id']
      const token = require('crypto').randomBytes(48).toString('hex');
      const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
      const dto = new PasswordResetTokenInput(token, userId, tomorrow);
      await this.repository.createPasswordResetToken(dto);
      this.mailService.sendEmail(email, this.config.get("SENDGRID_RESET_PASSWORD_TEMPLATE_ID"),{"URL" : this.config.get("FRONTEND_URL") + this.config.get("FRONTED_RESET_PASSWORD_PATH") + "?token=" + token || ""} );
      return token
  }

  async resetPassword(input: ResetPasswordInput){
      const resetPasswordToken = await this.repository.findPasswordResetTokenByToken(input.token);
      if(!resetPasswordToken){
          throw new NotFoundException('Token not found')
      }
      const expirationDate = resetPasswordToken['expirationDate'];
      const userId = resetPasswordToken['userId'];
      if(new Date() > expirationDate) {
          throw new ForbiddenException('Token expired')
      }
      const updateUserInput = new UpdateUserInput()
      updateUserInput.password = input.newPassword;
      return await this.userService.updateUser(userId, updateUserInput);
  }
}
