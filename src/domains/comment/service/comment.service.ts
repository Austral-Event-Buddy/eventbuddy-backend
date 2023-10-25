import {ICommentService} from "./comment.service.interface";
import {ICommentRepository} from "../repository";
import {NewCommentInput} from "../input";
import {Injectable, UnauthorizedException} from "@nestjs/common";
import {CommentDto} from "../dto/comment.dto";


@Injectable()
export class CommentService implements ICommentService{
    constructor(private repository: ICommentRepository ) {
    }

     async createComment(userId: number, input: NewCommentInput) {
        return  await this.repository.createComment(userId, input);

    }

    async deleteComment(userId: number, commentId: number) {
        if (!await this.checkIfUserIsAuthor(userId, commentId)){
            throw new UnauthorizedException('User is not authorized to delete this comment');
        }
        await this.repository.deleteComment(commentId);
        return true;
    }

    async updateComment(userId: number, commentId: number, text: string): Promise<CommentDto> {
        if (!await this.checkIfUserIsAuthor(userId, commentId)) {
            throw new UnauthorizedException('User is not authorized to update this comment');
        }
        const updatedComment = await this.repository.updateComment(commentId, text);
        return {
            id: updatedComment.id,
            text: updatedComment.text,
            userId: updatedComment.userId,
            parentId: updatedComment.parentId,
            eventId: updatedComment.eventId,
            createdAt: updatedComment.createdAt,
            updatedAt: updatedComment.updatedAt
        }
    }

    async getCommentsByEventId(eventId: number): Promise<CommentDto[]> {
        return this.repository.getCommentsByEventId(eventId);
    }
    async checkIfUserIsAuthor(userId: number, commentId: number): Promise<boolean> {
        const comment = await this.repository.checkIfUserIsAuthor(userId, commentId)
        return comment !== null;

    }


}