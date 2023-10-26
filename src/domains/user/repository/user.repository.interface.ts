import { UserDto } from '../dto/user.dto';
import { UpdateUserInput } from '../input/update.user.input';

export interface IUserRepository{
  findUserById(userId: number): Promise<UserDto>
  findUserByUsername(username: string): Promise<UserDto[]>
  updateUser(userId: number, input: UpdateUserInput): Promise<UserDto>
  deleteUser(userId: number): Promise<UserDto>
}
