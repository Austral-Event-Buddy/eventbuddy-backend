import {NewCommentInput} from "../input";
import {CommentDto} from "../dto/comment.dto";

export abstract class ICommentRepository{
    abstract createComment(userId:number, input: NewCommentInput):Promise<CommentDto>;
    abstract updateComment(commentId: number, text:string):Promise<CommentDto>;
    abstract deleteComment(commentId: number);
    abstract checkIfUserIsAuthor(userId: number, commentId: number):Promise<CommentDto>
    abstract getCommentsByEventId(eventId: number):Promise<CommentDto[]>
}