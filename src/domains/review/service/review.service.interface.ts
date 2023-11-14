import {ReviewInput, UpdateReviewInput} from "../input";
import {ReviewDto} from "../dto/review.dto";

export abstract class IReviewService{
    abstract createOrUpdateReview(userId: number, input: ReviewInput): Promise<ReviewDto>;
    abstract updateReview(reviewId:number, input: UpdateReviewInput ):Promise<ReviewDto>;
    abstract deleteReview(reviewId:number):Promise<ReviewDto>;
    abstract getEventReviews(eventId:number):Promise<ReviewDto[]>;
    abstract checkIfUserIsReviewOwner(userId: number, reviewId: number): Promise<boolean>;
}