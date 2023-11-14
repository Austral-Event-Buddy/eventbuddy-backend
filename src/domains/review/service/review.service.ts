import {Injectable, NotFoundException, UnauthorizedException} from "@nestjs/common";
import {IReviewService} from "./review.service.interface";
import {ReviewInput, UpdateReviewInput} from "../input";
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

    async createOrUpdateReview(userId: number, input: ReviewInput): Promise<ReviewDto> {
        const review = await this.repository.findReviewByUserAndEventId(userId, input.eventId)
        if (review === null) {
            return await this.repository.createReview(userId, input)
        }
        else {
            if (await this.checkIfUserIsReviewOwner(userId, review.id)){
                return await this.repository.updateReview(review.id, input)}
            else{
                throw new UnauthorizedException("User is not this review's owner");
            }
        }
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