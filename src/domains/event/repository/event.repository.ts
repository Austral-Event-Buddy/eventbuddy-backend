import {PrismaService} from '../../../prisma/prisma.service';
import {Injectable} from '@nestjs/common';
import {NewEventInput, updateEventInput} from '../input';
import {IEventRepository} from './event.repository.interface';
import {confirmationStatus} from '@prisma/client';
import {EventDto} from "../dto/event.dto";
import {GuestDto} from "../dto/guest.dto";
import {ElementDto} from "../../element/dto/element.dto";
import {ElementExtendedDto} from "../../element/dto/element.extended.dto";
import {CommentDto} from "../../comment/dto/comment.dto";

@Injectable()
export class EventRepository implements IEventRepository {
    constructor(private prisma: PrismaService) {
    }

    async getEventsByUserId(userId: number):Promise<EventDto[]> {
        return this.prisma.event.findMany({
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
            elements: true,
            comments: true,
        },
        orderBy: {
            date: 'asc',
        },
        });
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
                elements: true,
                comments: true,
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
        this.prisma.event.delete({
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
              comments: true,
              elements: true,
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
                users: {
                    select: {
                        id: true,
                        name: true,
                        username: true,
                        email: true,
                        createdAt: true,
                        updatedAt: true,
                    }
                }
            }
        })
    }
}
