import {Injectable} from "@nestjs/common";
import {IReviewRepository} from "./review.repository.interface";
import {ReviewInput} from "../input";
import {ReviewDto} from "../dto/review.dto";
import {PrismaService} from "../../../prisma/prisma.service";
import {UpdateReviewInput} from "../input";

@Injectable()
export class ReviewRepository implements IReviewRepository{
    constructor(private prisma: PrismaService) {
    }
    async createReview(userId: number, input: ReviewInput): Promise<ReviewDto> {
        return this.prisma.review.create({
            data:{
                userId: userId,
                eventId: input.eventId,
                rating: input.rating
            }
        })
    }

    async deleteReview(reviewId: number): Promise<ReviewDto> {
        return this.prisma.review.delete({
            where:{
                id: reviewId
            }

        })
    }

    async getEventReviews(eventId: number): Promise<ReviewDto[]> {
        return this.prisma.review.findMany({
            where:{
                eventId: eventId
            }

        })
    }

    async updateReview(reviewId: number, input: UpdateReviewInput): Promise<ReviewDto> {
        return this.prisma.review.update({
            data:{
                rating: input.rating
            },
            where:{
                id: reviewId
            }
        })
    }
    async isUserReviewOwner(userId: number, reviewId: number): Promise<ReviewDto> {
        return this.prisma.review.findUnique({
            where:{
                id: reviewId,
                userId: userId
            }
        })
    }

    findReviewByUserAndEventId(userId: number, eventId: number): Promise<ReviewDto> {
        return this.prisma.review.findUnique({
            where:{
                userId_eventId:{
                    userId: userId,
                    eventId: eventId
                }
            }

        })
    }
}