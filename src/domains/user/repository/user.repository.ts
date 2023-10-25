import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { UserDto } from '../dto/user.dto';
import { IUserRepository } from './user.repository.interface';
import { UpdateUserInput } from '../input/update.user.input';

@Injectable()
export class UserRepository implements IUserRepository{
  constructor(private prisma: PrismaService) {}
  async findUserById(userId: number): Promise<UserDto> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) throw new ForbiddenException('User not found');
    return user;
  }

    async findUserByUsername(username: string): Promise<UserDto> {
        return this.prisma.user.findUnique({
            where: {
                username: username,
            },
        });
    }

    async updateUser(userId: number, input: UpdateUserInput): Promise<UserDto> {
        return this.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                name: input.name,
                email: input.email,
                password: input.password,
            },
        });
    }

    async deleteUser(userId: number): Promise<UserDto> {
        return this.prisma.user.delete({
            where: {
                id: userId,
            },
        });
    }
}
