import { User } from '@prisma/client';
import {PasswordResetTokenInput, RegisterInput} from '../input';
import { UserDto } from '../../user/dto/user.dto';
export abstract class IAuthRepository {

	abstract findUserById(userId: number): Promise<UserDto>;

	abstract findUserByEmail(email: string): Promise<UserDto>;

	abstract findUserByUsername(username: string): Promise<UserDto>;

	abstract createUser(dto: RegisterInput): Promise<UserDto>;

    abstract createPasswordResetToken(dto: PasswordResetTokenInput): Promise<PasswordResetTokenInput>;

    abstract findPasswordResetTokenByToken(token:string): Promise<PasswordResetTokenInput>;
}
