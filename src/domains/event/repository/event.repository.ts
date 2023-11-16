import {PrismaService} from '../../../prisma/prisma.service';
import {Inject, Injectable} from '@nestjs/common';
import {NewEventInput, updateEventInput} from '../input';
import {IEventRepository} from './event.repository.interface';
import {User, confirmationStatus} from '@prisma/client';
import {EventDto} from "../dto/event.dto";
import {GuestDto} from "../dto/guest.dto";
import {ElementDto} from "../../element/dto/element.dto";
import {ElementExtendedDto} from "../../element/dto/element.extended.dto";
import {CommentDto} from "../../comment/dto/comment.dto";
import { IS3Service } from '../../s3/service/s3.service.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EventRepository implements IEventRepository {
    constructor(
        private prisma: PrismaService,
        private s3Service: IS3Service,  
        private config: ConfigService,
    ) {
    }

    async getEventsByUserId(userId: number):Promise<EventDto[]> {
        const e = await this.prisma.event.findMany({
            where: {
                OR: [{creatorId: userId}, {guests: {some: {userId: userId}}}],
                NOT: [{guests: {some: {userId: userId, confirmationStatus: 'NOT_ATTENDING'}}}]
            },
            include: {
                guests: {
                    include: {
                        user: true,
                    },
                },
                reviews: true,
            },
            orderBy: {
                date: 'asc',
            },
        });

        return await Promise.all(
            e.map(async event => {
                return {
                    ...event,
                    rating: await this.prisma.review.aggregate({
                        where: { eventId: event.id }, _avg: { rating: true }
                    }).then(res => res._avg.rating)
                }
            })
        )
    };

    async getEventByEventId(eventId: number): Promise<EventDto> {
        return this.prisma.event.findUnique({
                where: {
                    id: eventId
                }
            }
        )
    }

    async countGuestsByEventId(eventId: number) {
        return this.prisma.guest.count({
            where: {
                eventId: eventId,
                confirmationStatus: {in: ['ATTENDING']},
            },
        });
    }

    async findConfirmationStatus(
        userId: number,
        eventId: number,
    ): Promise<confirmationStatus> {
        return (
            await this.prisma.guest.findUnique({
                where: {
                    userId_eventId: {userId, eventId},
                },
                select: {
                    confirmationStatus: true,
                },
            })
        ).confirmationStatus;
    }

    async getEventsByNameOrDescriptionAndUserId(userId: number, input: string): Promise<EventDto[]> {
        const keywords = input.split(' ');

        const keywordConditions = keywords.map((keyword) => ({
            OR: [
                {name: {contains: keyword}},
                {description: {contains: keyword}},
            ],
        }));
        return this.prisma.event.findMany({
            where: {
                OR: [...keywordConditions],
                AND: [
                    {
                        OR: [
                            {creatorId: userId},
                            {guests: {some: {userId: userId}}},
                        ],
                        NOT: [{guests: {some: {userId: userId, confirmationStatus: 'NOT_ATTENDING'}}}]
                    },
                ],
            },
            include: {
                guests: {
                    include: {
                        user: true,
                    },
                },
            },
            orderBy: {
                date: 'asc',
            },
            });
        }

    async getHostGuest(userId: number, eventId: number): Promise<GuestDto> {
        return this.prisma.guest.findUnique({
            where: {
                userId_eventId: {userId, eventId},
                isHost: true,
            },
        });
    }

    async createEvent(userId: number, input: NewEventInput): Promise<EventDto> {
        return this.prisma.event.create({
            data: {
                name: input.name,
                description: input.description,
                coordinates: input.coordinates,
                date: input.date,
                confirmationDeadline: input.confirmationDeadline,
                creatorId: userId,
                guests: {
                    create: {
                        userId: userId,
                        confirmationStatus: 'ATTENDING',
                        isHost: true,
                    },
                },
            },
        });
    }

    async updateEvent(eventId: number, input: updateEventInput): Promise<EventDto> {
        return this.prisma.event.update({
            where: {
                id: eventId,
            },
            data: {
                name: input.name,
                description: input.description,
                coordinates: input.coordinates,
                date: input.date,
                confirmationDeadline: input.confirmationDeadline,
            },
        });
    }

    async checkIfUserIsCreator(userId: number, eventId: number): Promise<EventDto> {
        return this.prisma.event.findUnique({
            where: {
                id: eventId,
                creatorId: userId
            },
        });
    }

    async checkIfUserIsInvited(userId: number, eventId: number): Promise<GuestDto> {
        return this.prisma.guest.findUnique({
            where: {
                userId_eventId: { userId, eventId },
            },
        });
    }

    async deleteEventAndGuests(eventId: number) {
        await this.prisma.event.delete({
            where: {
                id: eventId,
            }
        });
    }

    getEvent(eventId: number): Promise<EventDto> {
        return this.prisma.event.findUnique({
            where: {
              id: eventId,
            },
            include: {
              guests: {
                include: {
                  user: true,
                },
              },
              comments: {
                where: { parentId: null },
                include: {
                    author: true,
                }
              },
              elements: {
                include: {
                    users: true,
                }
              },
            }
        });
    }

    async inviteGuest(eventId: number, invitedId: number, isHost: boolean): Promise<GuestDto> {
        return this.prisma.guest.create({
            data: {
                userId: invitedId,
                eventId: eventId,
                isHost: isHost,
                confirmationStatus: 'PENDING',
            },
        });
    }

    async answerInvite(guestId: number, answer: confirmationStatus): Promise<GuestDto> {
        return this.prisma.guest.update({
            where: {
                id: guestId,
            },
            data: {
                confirmationStatus: answer,
            },
        });
    }

    //Should only return with status pending (?)
    async getInvitesByUser(userId: number): Promise<GuestDto[]> {
        return this.prisma.guest.findMany({
            where: {
                userId: userId,
            },
        });
    }

    getGuest(userId: number, eventId: number): Promise<GuestDto> {
        return this.prisma.guest.findUnique({
            where: {
                userId_eventId: {userId, eventId},
            },
        });
    }
    getGuestsByEvent(eventId: number): Promise<GuestDto[]> {

        return this.prisma.guest.findMany({
            where: {
                eventId: eventId,
            },
        });
    }
    getElementsByEvent(eventId: number): Promise<ElementExtendedDto[]> {
        return this.prisma.element.findMany({
            where: {
                eventId: eventId,
            },
            include: {
                users: true,
            }
        })
    }

    async getCommentReplies(event: EventDto): Promise<EventDto> {
        return {
            ...event,
            comments: await Promise.all(event.comments.map(async comment => {
                return {
                    ...comment,
                    author: {
                        ...comment.author,
                        profilePictureUrl: await this.getUserProfilePicture(comment.author as User)
                    },
                    replies: await this.getReplies(comment.id)
                }
            })),
        }
    }

    async getReplies(commentId: number): Promise<CommentDto[]> {
        const replies = await this.prisma.comment.findMany({
            where: {
                parentId: commentId
            },
            include: {
                author: true,
            }
        })

        return await Promise.all(replies.map(async reply => {
            return {
                ...reply,
                author: {
                    ...reply.author,
                    profilePictureUrl: await this.getUserProfilePicture(reply.author)
                },
                replies: await this.getReplies(reply.id)
            }
        }))
    }

    async getUserProfilePicture(user: User): Promise<string> {
        if (user.defaultPic) return this.s3Service.getSignedUrl(this.config.get("DEFAULT_PROFILE_PICTURE"))
        return this.s3Service.getSignedUrl(`${user.id}`)
    }
}
