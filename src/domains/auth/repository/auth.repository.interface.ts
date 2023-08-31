import { User } from '@prisma/client';
import { RegisterInput } from '../input';
export abstract class IAuthRepository {

	abstract findUserById(userId: number): Promise<User>;

	abstract findUserByEmail(email: string): Promise<User>;

	abstract findUserByUsername(username: string): Promise<User>;

	abstract createUser(dto: RegisterInput): Promise<User>;
}
