import {Body, Controller, Get, Param, Request, UseGuards} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/auth.guard';
import { Request as ExpressRequest } from 'express';
import { GetUserDto } from './dto/get.user.dto';
import {getUserByUsername} from "./input";
import {UserService} from "./user.service";
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Request() request: ExpressRequest): GetUserDto {
    delete request.user['password'];
    return request.user as GetUserDto;
  }

  @Get('by_username/:username')
  async getUserByUsername(@Param('username') username: string): Promise<GetUserDto[]> {
      const users = await this.userService.getUserByUsername(username)
      return users.map(user => new GetUserDto(user))
  }
}
