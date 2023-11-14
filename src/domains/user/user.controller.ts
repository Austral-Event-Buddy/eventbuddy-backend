import {Body, Controller, Delete, Get, Put, Request, UseGuards, Param, BadRequestException, ForbiddenException} from '@nestjs/common';
import {JwtAuthGuard} from '../auth/auth.guard';
import {Request as ExpressRequest} from 'express';
import {GetUserDto} from './dto/get.user.dto';
import {getUserByUsername} from "./input";
import {UserService} from "./service/user.service";
import {UpdateUserInput} from './input/update.user.input';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {
    }

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

	@Get('by_id/:id')
	async getUserById(@Param('id') id: string): Promise<UserDto> {
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
		const user = await this.userService.getUserById(parseInt(id))
		return new GetUserDto(user)
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
}
