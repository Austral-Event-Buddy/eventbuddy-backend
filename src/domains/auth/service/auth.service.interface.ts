import {LoginInput, RegisterInput, ResetPasswordInput} from '../input';
import { UserDto } from '../../user/dto/user.dto';
import { TokenDto } from '../dto/register.dto';
import {GetUserDto} from "../../user/dto/get.user.dto";
import {GetUserWithPicDto} from "../../user/dto/get.user.with.pic.dto";

export abstract class IAuthService {
	abstract register(dto: RegisterInput): Promise<TokenDto>;
	abstract login(dto: LoginInput): Promise<TokenDto>;
	abstract findUserById(userId: number): Promise<UserDto>;
	abstract signToken(userId: number): Promise<TokenDto>;
    abstract sendResetPasswordEmail(email: string): Promise<string>;
    abstract resetPassword(input: ResetPasswordInput): Promise<UserDto>;
	abstract encryptPassword(password: String): Promise<string>;
}
