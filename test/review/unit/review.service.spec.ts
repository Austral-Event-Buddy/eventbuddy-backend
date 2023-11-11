import {IReviewService, ReviewService} from "../../../src/domains/review/service";
import {Test, TestingModule} from "@nestjs/testing";
import {IReviewRepository} from "../../../src/domains/review/repository";
import {ReviewRepositoryUtil} from "../util/review.repository.util";

describe("Review Service unit test",()=>{
    let reviewService: IReviewService;
    beforeEach(async () => {
        const reviewServiceProvider = {
            provide: IReviewService,
            useClass: ReviewService,
        }
        const reviewRepositoryProvider = {
            provide: IReviewRepository,
            useClass: ReviewRepositoryUtil,
        }
        const app: TestingModule = await Test.createTestingModule({
            imports: [],
            providers: [
                reviewRepositoryProvider,
                reviewServiceProvider,
            ],
        })
            .compile();
        reviewService = app.get<IReviewService>(IReviewService);

    })
    const userId = 1;
    const newReviewInput = {
        eventId: 1,
        rating: 5,
        date: new Date(10,10)
    }

    it("Create a review", async ()=>{
        const review = {
            id: 1,
            rating: newReviewInput.rating,
            userId: userId,
            eventId: newReviewInput.eventId,
            createdAt: undefined,
            updatedAt: undefined
        }
        const result = await reviewService.createReview(userId, newReviewInput);
        expect(result).toEqual(review);
    })
    const updateReviewInput={
        rating: 4
    }
    it("Update a review", async ()=>{
        const review = await reviewService.createReview(userId, newReviewInput);
        const updatedReview = await reviewService.updateReview(review.id, updateReviewInput);
        expect(updatedReview.rating).not.toEqual(review.rating);
        expect(updatedReview.rating).toEqual(updateReviewInput.rating);
        expect(updatedReview.id).toEqual(review.id);

    })
    it("Delete a review", async ()=>{
        const review = await reviewService.createReview(userId, newReviewInput);
        await reviewService.deleteReview(review.id);
        const result = await reviewService.getEventReviews(review.eventId);
        expect(result).toEqual([]);
    })
    it("Get event reviews", async ()=>{
        const review = await reviewService.createReview(userId, newReviewInput);
        const result = await reviewService.getEventReviews(review.eventId);
        expect(result).toEqual([review]);
    })
    it("Check if user is review owner", async ()=>{
        const review = await reviewService.createReview(userId, newReviewInput);
        const result = await reviewService.checkIfUserIsReviewOwner(userId, review.id);
        expect(result).toEqual(true);
    })
    it('Check if user is not review owner ', async () => {
        const review = await reviewService.createReview(userId, newReviewInput);
        const result = await reviewService.checkIfUserIsReviewOwner(2, review.id);
        expect(result).toEqual(false);

    });


})