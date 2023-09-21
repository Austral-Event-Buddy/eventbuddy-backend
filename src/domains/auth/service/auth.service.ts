import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { User } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

import { LoginInput, RegisterInput } from '../input';
import { IAuthService } from "./auth.service.interface";
import { IAuthRepository } from "../repository/auth.repository.interface";
import { UserDto } from '../../user/dto/user.dto';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private repository: IAuthRepository,
    private jwt: JwtService,
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
    let user: User;
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
}
