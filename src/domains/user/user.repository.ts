import {ForbiddenException, Injectable} from "@nestjs/common";
import {PrismaService} from "../../prisma/prisma.service";


@Injectable()
export class UserRepository {
    constructor(private prisma: PrismaService) {
    }
    async findUserById(userId: number) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
        if (!user) throw new ForbiddenException('User not found');
        return user;
    }
}