import {ICommentRepository} from "./comment.repository.interface";
import {PrismaService} from "../../../prisma/prisma.service";
import {NewCommentInput} from "../input";
import {text} from "express";
import {CommentDto} from "../dto/comment.dto";
import {Injectable} from "@nestjs/common";
@Injectable()
export class CommentRepository implements ICommentRepository{
    constructor(private prisma: PrismaService){

    }

    async createComment(userId: number, input: NewCommentInput):Promise<CommentDto> {
        return this.prisma.comment.create({
            data: {
                userId: userId,
                eventId: input.eventId,
                text: input.text,
                parentId: input.parentId || undefined
            }
        })
    }

    async deleteComment(commentId: number) {
        this.prisma.comment.delete({
            where:{
                id: commentId
            }
        })
    }

    async updateComment(commentId: number, text: string):Promise<CommentDto> {
        return this.prisma.comment.update({
            where:{
                id: commentId,
            },
            data:
                {
                    text: text
                }
        });
    }
    async checkIfUserIsAuthor(userId: number, commentId:number):Promise<CommentDto>{
        return this.prisma.comment.findUnique({
            where:{
                id: commentId,
                userId: userId
            }
        })
    }

    async getCommentsByEventId(eventId: number):Promise<CommentDto[]> {
        return this.prisma.comment.findMany({
            where:{
                eventId: eventId
            }
        })
    }

}