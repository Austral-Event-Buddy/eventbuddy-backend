import {Injectable} from "@nestjs/common";
import {UserRepository} from "./user.repository";
import {GetMeDto} from "./dto";


@Injectable()
export class UserService {
    constructor(private userRepository: UserRepository) {
    }
    getMe(request: Request){
        const token = request['user'];
        const userId = token.id;
        const user = this.userRepository.findUserById(userId);
        return new GetMeDto(user.name, userId);
    }
}