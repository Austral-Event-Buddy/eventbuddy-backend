export class GetMeDto {
  constructor(name: string, id: number) {
    this.name = name;
    this.id = id;
  }

  name: string;
  id: number;
}
