class UserDto{
  id:        number
  email:     String
  username:  String
  name?:      String
  password:  String
  createdAt: Date
  updatedAt: Date

  constructor(userDto: UserDto) {
    this.id = userDto.id;
    this.email = userDto.email;
    this.username = userDto.username;
    this.name = userDto.name? userDto.name : null;
    this.password = userDto.password;
    this.createdAt = userDto.createdAt;
    this.updatedAt = userDto.updatedAt;
  }
}
