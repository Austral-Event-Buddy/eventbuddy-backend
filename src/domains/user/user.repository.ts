import {Injectable} from '@nestjs/common';
import {PrismaService} from '../../prisma/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}
  async findUserById(userId: number) {
      return this.prisma.user.findUnique({
          where: {
              id: userId,
          },
      });
  }

    async findUserByUsername(username: string) {
        return this.prisma.user.findUnique({
            where: {
                username: username,
            },
        });
    }
}
