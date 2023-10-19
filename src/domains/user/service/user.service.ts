import {Injectable, NotFoundException} from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';
import { IUserService } from './user.service.inteface';
import { UpdateUserInput } from '../input/update.user.input';

@Injectable()
export class UserService implements IUserService{
  constructor(private userRepository: UserRepository) {}

  async getUserByUsername(username: string){
      const user = await this.userRepository.findUserByUsername(username);
      if(!user){
          throw new NotFoundException('User could not be found');
      }
      return user;
  }

  async updateUser(userId: number, input: UpdateUserInput){
      const user = await this.userRepository.updateUser(userId, input);
      if(!user){
          throw new NotFoundException('User could not be found');
      }
      return user;
  }

  async deleteUser(userId: number){
      const user = await this.userRepository.deleteUser(userId);
      if(!user){
          throw new NotFoundException('User could not be found');
      }
      return user;
  }
}
