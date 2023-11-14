import {NewCommentInput} from "../input";
import {CommentDto} from "../dto/comment.dto";

export abstract class ICommentService{
    abstract createComment(userId: number, input: NewCommentInput):Promise<CommentDto>;
    abstract updateComment(userId: number,commentId: number, text: string):Promise<CommentDto>;
    abstract deleteComment(userId: number, commentId: number):Promise<boolean>;
    abstract getCommentsByEventId(eventId: number):Promise<CommentDto[]>
    abstract checkIfUserIsAuthor(userId: number, commentId: number):Promise<boolean>

    abstract getReplies(commentId: number) : Promise<CommentDto[]>
}