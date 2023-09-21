import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/auth.guard';
import { Request as ExpressRequest } from 'express';
import { GetMeDto } from './dto';

@Controller('user')
export class UserController {
  constructor() {}
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Request() request: ExpressRequest): GetMeDto {
    delete request.user['password'];
    return request.user;
  }
}
