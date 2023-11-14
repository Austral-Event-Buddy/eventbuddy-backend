import {ReviewInput, UpdateReviewInput} from "../input";
import {ReviewDto} from "../dto/review.dto";

export abstract class IReviewRepository{
    abstract findReviewByUserAndEventId(userId: number, eventId: number): Promise<ReviewDto>;
    abstract createReview(userId: number, input: ReviewInput): Promise<ReviewDto>;
    abstract updateReview(reviewId:number, input: UpdateReviewInput ):Promise<ReviewDto>;
    abstract deleteReview(reviewId:number):Promise<ReviewDto>;
    abstract getEventReviews(eventId:number):Promise<ReviewDto[]>;
    abstract isUserReviewOwner(userId: number, reviewId: number): Promise<ReviewDto>;
}