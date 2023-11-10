import {Body, Controller, Delete, Get, Put, Request, UseGuards, Param, Post} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/auth.guard';
import { Request as ExpressRequest } from 'express';
import { GetUserDto } from './dto/get.user.dto';
import {getUserByUsername} from "./input";
import {UserService} from "./service/user.service";
import { UpdateUserInput } from './input/update.user.input';
import {ProfilePictureDto} from "./dto/profile.picture.dto";
import {GetUserWithPicDto} from "./dto/get.user.with.pic.dto";
import {UserDto} from "./dto/user.dto";
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Request() request: ExpressRequest): Promise<GetUserWithPicDto> {
    delete request.user['password'];
    const user = request.user as UserDto;
    const signedUrl = await this.userService.getProfilePicture(
        user.id,
        user.defaultPic
    )
    return new GetUserWithPicDto(user, signedUrl);
  }

  @Get('by_username/:username')
  async getUserByUsername(@Param('username') username: string): Promise<GetUserDto[]> {
      return await this.userService.getUserByUsername(username)
  }

  @UseGuards(JwtAuthGuard)
  @Put('update')
  async updateUser(@Request() request: ExpressRequest, @Body() input: UpdateUserInput): Promise<GetUserDto> {
      return await this.userService.updateUser(request.user['id'], input)
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete')
  async deleteUser(@Request() request: ExpressRequest): Promise<GetUserDto> {
      const user = await this.userService.deleteUser(request.user['id'])
      return new GetUserDto(user);
  }

  @UseGuards(JwtAuthGuard)
  @Put('picture')
  async uploadProfilePicture(@Request() request: ExpressRequest): Promise<ProfilePictureDto> {
      const signedUrl = await this.userService.uploadProfilePicture(request.user['id'])
      return new ProfilePictureDto(signedUrl);
  }

    @UseGuards(JwtAuthGuard)
    @Get('picture')
    async getProfilePicture(@Request() request: ExpressRequest): Promise<ProfilePictureDto> {
        const signedUrl = await this.userService.getProfilePicture(
            request.user['id'],
            request.user['defaultPic']
        )
        return new ProfilePictureDto(signedUrl);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('picture')
    async deleteProfilePicture(@Request() request: ExpressRequest): Promise<void> {
        await this.userService.deleteProfilePicture(request.user['id'])
    }
}
