import {Injectable} from "@nestjs/common";
import {UserRepository} from "./user.repository";
import {GetMeDto} from "./dto";


@Injectable()
export class UserService {
    constructor(private userRepository: UserRepository) {
    }
    getMe(request: Request){
        const user = request['user'];
        return new GetMeDto(user.name, user.id);
    }
}