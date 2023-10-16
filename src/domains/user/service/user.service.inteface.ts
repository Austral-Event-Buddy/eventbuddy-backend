import { UserDto } from '../dto/user.dto';
import { UpdateUserInput } from '../input/update.user.input';

export interface IUserService{
  getUserByUsername(username: string): Promise<UserDto>
  updateUser(userId: number, input: UpdateUserInput): Promise<UserDto>
  deleteUser(userId: number): Promise<UserDto>
}
