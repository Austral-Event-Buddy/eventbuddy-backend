import { UserDto } from "src/domains/user/dto/user.dto";

export class CommentDto{
    id: number;
    userId: number;
    eventId: number;
    parentId: number;
    text: string;
    createdAt: Date;
    updatedAt: Date;
    author?: UserDto;

    constructor(newComment: CommentDto) {
        this.id = newComment.id;
        this.userId = newComment.userId;
        this.eventId = newComment.eventId;
        this.parentId = newComment.parentId;
        this.text = newComment.text;
        this.createdAt = newComment.createdAt;
        this.updatedAt = newComment.updatedAt;
    }
}