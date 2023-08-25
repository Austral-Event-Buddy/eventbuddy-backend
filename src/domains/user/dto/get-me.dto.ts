
export class GetMeDto {
    constructor(name, id) {
        this.name = name;
        this.id = id;
    }

    name: string;
    id: number;
}