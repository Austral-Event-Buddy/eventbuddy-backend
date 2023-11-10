import { UserDto } from '../dto/user.dto';
import { UpdateUserInput } from '../input/update.user.input';
import {GetUserWithPicDto} from "../dto/get.user.with.pic.dto";

export interface IUserService{
  getUserByUsername(username: string): Promise<GetUserWithPicDto[]>
  getUserById(userId: number): Promise<GetUserWithPicDto>
  updateUser(userId: number, input: UpdateUserInput): Promise<GetUserWithPicDto>
  deleteUser(userId: number): Promise<UserDto>
}
