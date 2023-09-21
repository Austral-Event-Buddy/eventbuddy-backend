export class TokenDto {

  access_token: string;

  constructor(registerDto: TokenDto) {
    this.access_token = registerDto.access_token;
  }
}
