import {Module} from "@nestjs/common";
import {UserController} from "./user.controller";
import {UserService} from "./user.service";
import {UserRepository} from "./user.repository";
import {PrismaService} from "../../prisma/prisma.service";
import {ConfigService} from "@nestjs/config";
import {JwtModule, JwtService} from "@nestjs/jwt";
import {AuthModule} from "../auth/auth.module";
import {AuthService} from "../auth/auth.service";
import {JwtStrategy} from "../auth/auth.guard";
import {AuthRepository} from "../auth/auth.repository";

@Module({
    controllers: [UserController],
    providers:[UserService, UserRepository, PrismaService, ConfigService, AuthService, AuthRepository, JwtService],
})
export class UserModule {}