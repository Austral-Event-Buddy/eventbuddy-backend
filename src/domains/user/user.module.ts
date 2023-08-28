import {Module} from "@nestjs/common";
import {UserController} from "./user.controller";
import {UserService} from "./user.service";
import {UserRepository} from "./user.repository";
import {PrismaService} from "../../prisma/prisma.service";
import {ConfigService} from "@nestjs/config";
import {JwtService} from "@nestjs/jwt";
import {AuthService} from "../auth/auth.service";
import {AuthRepository} from "../auth/auth.repository";

@Module({
    controllers: [UserController],
    providers:[UserService, UserRepository, PrismaService, ConfigService, AuthService, AuthRepository, JwtService],
})
export class UserModule {}