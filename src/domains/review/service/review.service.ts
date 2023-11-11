import {Injectable, NotFoundException, UnauthorizedException} from "@nestjs/common";
import {IReviewService} from "./review.service.interface";
import {NewReviewInput, UpdateReviewInput} from "../input";
import {ReviewDto} from "../dto/review.dto";
import {IReviewRepository} from "../repository";
import e from "express";

@Injectable()
export class ReviewService implements IReviewService {
    constructor(private repository: IReviewRepository) {
    }

    async checkIfUserIsReviewOwner(userId: number, reviewId: number): Promise<boolean> {
        const review = await this.repository.isUserReviewOwner(userId, reviewId);
        return review !== null;
    }

    async createReview(userId: number, input: NewReviewInput): Promise<ReviewDto> {
        return await this.repository.createReview(userId, input)
    }

    async deleteReview(reviewId: number): Promise<ReviewDto> {
        return await this.repository.deleteReview(reviewId)

    }

    async getEventReviews(eventId: number): Promise<ReviewDto[]> {
        return await this.repository.getEventReviews(eventId)
    }

    async updateReview(reviewId: number, input: UpdateReviewInput): Promise<ReviewDto> {
        const review = await this.repository.updateReview(reviewId, input);
        if (review) {
            return {
                id: review.id,
                rating: review.rating,
                userId: review.userId,
                eventId: review.eventId,
                createdAt: review.createdAt,
                updatedAt: review.updatedAt
            }
        } else {
            throw new NotFoundException("Review not found")
        }
    }

}