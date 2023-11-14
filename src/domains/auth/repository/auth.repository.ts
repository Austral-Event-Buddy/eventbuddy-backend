import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { RegisterInput } from '../input';
import { IAuthRepository } from "./auth.repository.interface";
import { UserDto } from '../../user/dto/user.dto';
import {PasswordResetTokenInput} from "../input/passwordresettoken.input";

@Injectable()
export class AuthRepository implements IAuthRepository {
  constructor(private prisma: PrismaService) {}

  async findUserById(userId: number): Promise<UserDto> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    delete user.password;
    return user;
  }

  async findUserByEmail(email: string): Promise<UserDto> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) throw new ForbiddenException('Credentials incorrect');
    return user;
  }

  async findUserByUsername(username: string): Promise<UserDto> {
    const user = await this.prisma.user.findUnique({
      where: {
        username,
      },
    });
    if (!user) throw new ForbiddenException('User not found');
    return user;
  }

  async createUser(dto: RegisterInput): Promise<UserDto> {
    return this.prisma.user.create({
      data: {
        email: dto.email,
        password: dto.password,
        username: dto.username,
        name: dto.name,
      },
    });
  }

  async createPasswordResetToken(dto: PasswordResetTokenInput):Promise<PasswordResetTokenInput> {
      return this.prisma.passwordResetToken.create({
          data: {
             token: dto.token,
              userId: dto.userId,
              expirationDate: dto.expirationDate
          },
      });
  }

  async findPasswordResetTokenByToken(token: string) {
      return this.prisma.passwordResetToken.findUnique({
          where: {
              token,
          },
      });
  }
}
