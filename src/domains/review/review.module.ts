import {IReviewService, ReviewService} from "./service";
import {IReviewRepository, ReviewRepository} from "./repository";
import {Module} from "@nestjs/common";
import {ReviewController} from "./review.controller";
import {EventModule} from "../event/event.module";

const reviewServiceProvider={
    provide: IReviewService,
    useClass: ReviewService
}
const reviewRepositoryProvider = {
    provide: IReviewRepository,
    useClass: ReviewRepository,
};
@Module({
    controllers:[ReviewController],
    providers:[reviewServiceProvider, reviewRepositoryProvider],
    imports:[EventModule],
})
export class ReviewModule{}