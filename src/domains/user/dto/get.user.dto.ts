import { UserDto } from './user.dto';

export class GetUserDto {
    id: number;
    email: string;
    username: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    constructor(getUserDto: UserDto) {
        this.id = getUserDto.id;
        this.email = getUserDto.email;
        this.username = getUserDto.username;
        this.name = getUserDto.name ? getUserDto.name : null;
        this.createdAt = getUserDto.createdAt;
        this.updatedAt = getUserDto.updatedAt;
    }
}
