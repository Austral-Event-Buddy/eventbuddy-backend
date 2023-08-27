import {Controller, Get, Req, UseGuards} from "@nestjs/common";
import {UserService} from "./user.service";
import {AuthGuard} from "../auth/auth.guard";

@Controller('user')
export class UserController{

    constructor(private userService: UserService) {
    }
    // @UseGuards(AuthGuard)
    @Get('me')
    getMe(@Req() request: any) {
        return this.userService.getMe(request);
    }
}