import {Injectable} from "@nestjs/common";
import {ICommentRepository} from "../../../src/domains/comment/repository";
import {CommentDto} from "../../../src/domains/comment/dto/comment.dto";
import {NewCommentInput} from "../../../src/domains/comment/input";
import {Comment} from "@prisma/client";

@Injectable()
export class CommentRepositoryUtil implements ICommentRepository{
    id  = 1;
    comments: Comment[] = [];
    checkIfUserIsAuthor(userId: number, commentId: number): Promise<CommentDto> {
        for (const comment of this.comments){
            if (comment.id === commentId && comment.userId === userId){
                return Promise.resolve(comment);
            }
        }
        return Promise.resolve(null)
    }

    createComment(userId: number, input: NewCommentInput): Promise<CommentDto> {
        let comment : Comment = {
            id: this.id,
            text: input.text,
            userId: userId,
            parentId: input.parentId || undefined,
            eventId: input.eventId,
            createdAt: undefined,
            updatedAt: undefined,
        }
        this.comments.push(comment);
        return Promise.resolve(comment)
    }

    deleteComment(commentId: number) {
        const commentsResult = [];
        for(const comment of this.comments){
            if(comment.id !== commentId && comment.parentId !== commentId){
                commentsResult.push(comment);
            }
        }
        this.comments= commentsResult;
    }

    getCommentsByEventId(eventId: number): Promise<CommentDto[]> {
        const commentsResult = [];
        for(const comment of this.comments){
            if(comment.eventId === eventId){
                commentsResult.push(comment);
            }
        }
        return Promise.resolve(commentsResult);
    }

    updateComment(commentId: number, text: string): Promise<CommentDto> {
        const originalComment = this.comments.find(comment => comment.id === commentId);
        const updatedComment:Comment ={
            id: originalComment.id,
            text: text,
            userId: originalComment.userId,
            parentId: originalComment.parentId,
            eventId: originalComment.eventId,
            createdAt: originalComment.createdAt,
            updatedAt: originalComment.updatedAt
        }
        return Promise.resolve(updatedComment);
    }

}