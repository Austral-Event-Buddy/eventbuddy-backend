export class ReviewDto {
    id: number
    userId: number
    eventId: number
    rating: number
    createdAt: Date
    updatedAt: Date

    constructor(reviewDto: ReviewDto){
        this.id = reviewDto.id;
        this.userId = reviewDto.userId;
        this.eventId = reviewDto.eventId;
        this.rating = reviewDto.rating;
        this.createdAt = reviewDto.createdAt;
        this.updatedAt = reviewDto.updatedAt;

    }
}