import {Injectable} from "@nestjs/common";
import {UserRepository} from "./user.repository";
import {GetMeDto} from "./dto";
import {JwtService} from "@nestjs/jwt";



@Injectable()
export class UserService {
    constructor(private userRepository: UserRepository, private jwtService: JwtService) {
    }
    async getMe(request: any) {
        const userId= this.getUserId(request);
        const user = await this.userRepository.findUserById(userId);
        return new GetMeDto(user.name, userId);
    }

    private getUserId(request: any){
        const authHeader = request.headers.authorization;
        const token = authHeader.replace('Bearer ', '');
        const decodedToken = this.jwtService.verify(token);
        return decodedToken.id
    }
}