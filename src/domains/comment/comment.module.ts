import {CommentService, ICommentService} from "./service";
import {ICommentRepository} from "./repository";
import {CommentRepository} from "./repository";
import {CommentController} from "./comment.controller";
import {Module} from "@nestjs/common";

const commentServiceProvider={
    provide: ICommentService,
    useClass: CommentService
};
const commentRepositoryProvider={
    provide: ICommentRepository,
    useClass: CommentRepository
}
@Module({
    controllers:[CommentController],
    providers:[commentRepositoryProvider,commentServiceProvider],
})
export class CommentModule{}
