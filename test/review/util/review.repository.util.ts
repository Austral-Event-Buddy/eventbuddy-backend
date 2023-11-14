import {Injectable} from "@nestjs/common";
import {IReviewRepository} from "../../../src/domains/review/repository";
import {ReviewInput, UpdateReviewInput} from "../../../src/domains/review/input";
import {ReviewDto} from "../../../src/domains/review/dto/review.dto";
import {Review} from "@prisma/client";


@Injectable()
export class ReviewRepositoryUtil implements IReviewRepository{
    reviews: ReviewDto[] = [];
    id = 1;
    createReview(userId: number, input: ReviewInput): Promise<ReviewDto> {
        let review : Review={
            id: this.id,
            userId: userId,
            eventId: input.eventId,
            rating: input.rating,
            createdAt: undefined,
            updatedAt: undefined
        }
        this.reviews.push(review);
        return Promise.resolve(review)
    }

    deleteReview(reviewId: number): Promise<ReviewDto> {
        const reviewsResult = [];
        for(const review of this.reviews){
            if(review.id !== reviewId){
                reviewsResult.push(review);
            }
        }
        this.reviews= reviewsResult;
        return Promise.resolve(undefined);
    }

    getEventReviews(eventId: number): Promise<ReviewDto[]> {
        const reviewsResult = [];
        for(const review of this.reviews){
            if(review.eventId === eventId){
                reviewsResult.push(review);
            }
        }
        return Promise.resolve(reviewsResult);
    }

    isUserReviewOwner(userId: number, reviewId: number): Promise<ReviewDto> {
        for (const review of this.reviews){
            if (review.id === reviewId && review.userId === userId){
                return Promise.resolve(review);
            }
        }
        return Promise.resolve(null)
    }

    updateReview(reviewId: number, input: UpdateReviewInput): Promise<ReviewDto> {
        const originalReview = this.reviews.find(review => review.id === reviewId);
        if (originalReview === undefined){
            return Promise.resolve(undefined)
        }
        const updatedReview:Review ={
            id: originalReview.id,
            userId: originalReview.userId,
            eventId: originalReview.eventId,
            rating: input.rating,
            createdAt: originalReview.createdAt,
            updatedAt: originalReview.updatedAt
        }
        return Promise.resolve(updatedReview);
    }

    findReviewByUserAndEventId(userId: number, eventId: number): Promise<ReviewDto> {
        for (const review of this.reviews){
            if (review.userId === userId && review.eventId === eventId){
                return Promise.resolve(review);
            }
        }
        return Promise.resolve(null)
    }

}