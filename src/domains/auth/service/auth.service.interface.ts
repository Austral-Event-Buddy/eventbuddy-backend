import { LoginInput, RegisterInput } from '../input';
import { UserDto } from '../../user/dto/user.dto';

export abstract class IAuthService {

	abstract register(dto: RegisterInput): Promise<{ access_token: string }>;

	abstract login(dto: LoginInput): Promise<{ access_token: string }>;

	abstract findUserById(userId: number): Promise<UserDto>;
	abstract signToken(userId: number): Promise<{ access_token: string }>;
}
