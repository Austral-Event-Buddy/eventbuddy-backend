export class GetMeDto {
  name: string;
  id: number;

  constructor(getMeDto: GetMeDto){
    this.name = getMeDto.name;
    this.id = getMeDto.id;
  }
}
