import {Controller, Get, Param, Post, UseGuards, Request, Body} from "@nestjs/common";
import {JwtAuthGuard} from "../auth/auth.guard";
import {ICommentService} from "./service";
import {Request as ExpressRequest} from 'express';
import {NewCommentInput} from "./input";


@UseGuards(JwtAuthGuard)
@Controller('comment')
export class CommentController{
    constructor(private commentService: ICommentService) {

    }
    @Get()
    getCommentsByEventId(@Param('eventId') eventId:string){
        const eventIdInt = parseInt(eventId);
        if (Number.isNaN(eventIdInt)){
            throw new TypeError("Event id must be a number")
        }
        return this.commentService.getCommentsByEventId(eventIdInt);
    }
    @Post()
    postComment(@Request() req: ExpressRequest, @Body() input: NewCommentInput){
        return this.commentService.createComment(req.user['id'],input);
    }
}
