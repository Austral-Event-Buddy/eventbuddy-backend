import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import {CommentService} from "./service/comment.service";
import {CommentRepository} from "./repository/comment.repository";
import { ICommentService } from './service';
import { ICommentRepository } from './repository';

const commentServiceProvider = {
	provide: ICommentService,
	useClass: CommentService,
};

const elementRepositoryProvider = {
	provide: ICommentRepository,
	useClass: CommentRepository,
};

@Module({
  controllers: [CommentController],
  providers: [commentServiceProvider, elementRepositoryProvider],
})
export class CommentModule {}

