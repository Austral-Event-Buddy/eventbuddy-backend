import {Injectable} from "@nestjs/common";
import {UserRepository} from "./user.repository";
import {GetMeDto} from "./dto";
import {JwtService} from "@nestjs/jwt";



@Injectable()
export class UserService {
    constructor(private userRepository: UserRepository) {
    }
    async getMe(userId: number) {
        const user = await this.userRepository.findUserById(userId);
        return new GetMeDto(user.name, userId);
    }
}