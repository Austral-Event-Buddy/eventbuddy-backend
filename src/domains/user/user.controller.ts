import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    ForbiddenException,
    Get,
    Param,
    Put,
    Request,
    UseGuards
} from '@nestjs/common';
import {JwtAuthGuard} from '../auth/auth.guard';
import {Request as ExpressRequest} from 'express';
import {GetUserDto} from './dto/get.user.dto';
import {UserService} from "./service/user.service";
import {UpdateUserInput} from './input/update.user.input';
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

	@Get('by_id/:id')
	async getUserById(@Param('id') id: string): Promise<GetUserWithPicDto> {
		const userId = parseInt(id);
		if (Number.isNaN(userId)) {
			throw new ForbiddenException('Event id must be a number');
		} else {
			return this.userService.getUserById(userId);
		}
	}
	@Get(':id')
	async getUserById1(@Param('id') id: string): Promise<GetUserDto> {
		const userId = parseInt(id)
		if (isNaN(userId)) throw new BadRequestException('Id must be a number')
        return await this.userService.getUserById(parseInt(id))
	}

    @UseGuards(JwtAuthGuard)
    @Put('update')
    async updateUser(@Request() request: ExpressRequest, @Body() input: UpdateUserInput): Promise<GetUserDto> {
        const user = await this.userService.updateUser(request.user['id'], input)
        return new GetUserDto(user);
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
