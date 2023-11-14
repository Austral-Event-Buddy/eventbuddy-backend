export class UserDto{
  id:        number
  email:     string
  username:  string
  password: string
  name?:      string
  defaultPic: boolean
  createdAt: Date
  updatedAt: Date

  constructor(userDto: UserDto) {
    this.id = userDto.id;
    this.email = userDto.email;
    this.username = userDto.username;
    this.password = userDto.password;
    this.name = userDto.name? userDto.name : null;
    this.defaultPic = userDto.defaultPic;
    this.createdAt = userDto.createdAt;
    this.updatedAt = userDto.updatedAt;
  }
}
