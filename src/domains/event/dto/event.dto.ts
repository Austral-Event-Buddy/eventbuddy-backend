import { CommentDto } from 'src/domains/comment/dto/comment.dto';

export class EventDto {
    id: number;
    name: string;
    description: string;
    creatorId: number;
    coordinates: number[];
    confirmationDeadline: Date;
    date: Date;
    updatedAt: Date;
    createdAt: Date;
    comments?: CommentDto[];

    constructor(newEvent: EventDto) {
        this.name = newEvent.name;
        this.description = newEvent.description;
        this.creatorId = newEvent.creatorId;
        this.coordinates = newEvent.coordinates;
        this.confirmationDeadline = newEvent.confirmationDeadline;
        this.date = newEvent.date;
        this.updatedAt = newEvent.updatedAt;
        this.createdAt = newEvent.createdAt;
        this.comments = newEvent.comments;
    }
}
