import {Module} from "@nestjs/common";
import {CommentController} from "./comment.controller";
import {CommentService, ICommentService} from "./service";
import {ICommentRepository} from "./repository";
import {CommentRepository} from "./repository/comment.repository";
const commentServiceProvider = {
  provide: ICommentService,
  useClass: CommentService,
};

const commentRepositoryProvider = {
  provide: ICommentRepository,
  useClass: CommentRepository,
};

@Module({
  controllers: [CommentController],
  providers: [
    commentServiceProvider,
    commentRepositoryProvider,
  ],
})
export class CommentModule {}