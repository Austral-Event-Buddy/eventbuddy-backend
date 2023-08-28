import {Controller, Get, Request, UseGuards} from "@nestjs/common";
import {UserService} from "./user.service";
import {JwtAuthGuard} from "../auth/auth.guard";
import { Request as ExpressRequest } from 'express';

@Controller('user')
export class UserController{

    constructor(private userService: UserService) {
    }
    @UseGuards(JwtAuthGuard)
    @Get('me')
    getMe(@Request() request: ExpressRequest) {
        delete request.user['password'];
        return request.user;
    }
}