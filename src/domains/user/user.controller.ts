import {Body, Controller, Get, Request, UseGuards} from '@nestjs/common';
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

  @Get('by_username')
  async getUserByUsername(@Body() input: getUserByUsername): Promise<GetUserDto> {
      const user = await this.userService.getUserByUsername(input.username)
      return new GetUserDto(user);
  }
}
