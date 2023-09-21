import { LoginInput, RegisterInput } from '../input';

export abstract class IAuthService {

	abstract register(dto: RegisterInput): Promise<{ access_token: string }>;

	abstract login(dto: LoginInput): Promise<{ access_token: string }>;

	abstract findUserById(userId: number): UserDto;
	abstract signToken(userId: number): Promise<{ access_token: string }>;
}
