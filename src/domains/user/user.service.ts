import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { GetMeDto } from './dto';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}
}
