import {NewReviewInput, UpdateReviewInput} from "../input";
import {ReviewDto} from "../dto/review.dto";

export abstract class IReviewService{
    abstract createReview(userId: number, input: NewReviewInput): Promise<ReviewDto>;
    abstract updateReview(reviewId:number, input: UpdateReviewInput ):Promise<ReviewDto>;
    abstract deleteReview(reviewId:number):Promise<ReviewDto>;
    abstract getEventReviews(eventId:number):Promise<ReviewDto[]>;
    abstract checkIfUserIsReviewOwner(userId: number, reviewId: number): Promise<boolean>;
}