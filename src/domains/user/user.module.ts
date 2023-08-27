import {Module} from "@nestjs/common";
import {UserController} from "./user.controller";
import {UserService} from "./user.service";
import {UserRepository} from "./user.repository";
import {PrismaService} from "../../prisma/prisma.service";
import {ConfigService} from "@nestjs/config";

@Module({
    controllers: [UserController],
    providers:[UserService, UserRepository, PrismaService, ConfigService]
})
export class UserModule {}