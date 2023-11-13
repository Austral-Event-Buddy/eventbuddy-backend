import {
    Controller, Post, UseGuards, Request, Body, ForbiddenException, UnauthorizedException, Param, Delete, Get
} from "@nestjs/common";
import {JwtAuthGuard} from "../auth/auth.guard";
import {IReviewService} from "./service";
import {Request as ExpressRequest} from 'express';
import {NewReviewInput, UpdateReviewInput} from "./input";
import {EventService, IEventService} from "../event/service";
import {updateEventInput} from "../event/input";


@UseGuards(JwtAuthGuard)
@Controller('review')
export class ReviewController {
    constructor(private reviewService: IReviewService, private eventService: EventService) {

    }

    @Post()
    async createReview(@Request() req: ExpressRequest, @Body() input: NewReviewInput) {
        if (await this.eventService.checkFutureEvent(input.eventId, input.date)) {
            throw new ForbiddenException("Event has not passed yet")
        } else if (!await this.eventService.isUserInvited(req.user['id'], input.eventId)) {
            throw new UnauthorizedException("User is not invited to this event")
        }
        return this.reviewService.createReview(req.user['id'], input)
    }
    @Get(":eventId")
    async getEventReviews(@Request() req: ExpressRequest, @Param('eventId') eventId: string) {
        const eventIdInt = parseInt(eventId)
        if (Number.isNaN(eventIdInt)) {
            throw new TypeError('Event id must be a number');
        }
        return await this.reviewService.getEventReviews(eventIdInt)

    }

    @Post(":reviewId")
    async updateReview(@Request() req: ExpressRequest, @Param('reviewId') reviewId: string,
                       @Body() input: UpdateReviewInput) {
        const reviewIdInt = parseInt(reviewId);
        if (Number.isNaN(reviewIdInt)) {
            throw new TypeError('Review id must be a number');
        }
        if (!await this.reviewService.checkIfUserIsReviewOwner(req.user['id'], reviewIdInt)) {
            throw new UnauthorizedException("User is not authorized to update this review")
        }
        return await this.reviewService.updateReview(reviewIdInt, input)
    }
    @Delete(":reviewId")
    async deleteReview(@Request() req: ExpressRequest, @Param('reviewId') reviewId: string) {
        const reviewIdInt = parseInt(reviewId);
        if (Number.isNaN(reviewIdInt)) {
            throw new TypeError('Review id must be a number');
        }
        if (!await this.reviewService.checkIfUserIsReviewOwner(req.user['id'], reviewIdInt)) {
            throw new UnauthorizedException("User is not authorized to delete this review")
        }
        return await this.reviewService.deleteReview(reviewIdInt)
    }

}