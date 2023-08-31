import {PrismaService} from '../../prisma/prisma.service';
import {Injectable} from '@nestjs/common';
import {confirmationStatus} from "@prisma/client";

@Injectable()
export class EventRepository {
    constructor(private prisma: PrismaService) {
    }

    async getEventsByUserId(userId: number) {
        return this.prisma.event.findMany({
            where: {
                OR: [
                    {creatorId: userId},
                    {guests: {some: {userId: userId}}}
                ]
            },
            select: {
                name: true,
                description: true,
                coordinates: true,
                date:true,
                guests:{
                    where:{
                        userId:userId
                    },
                    select:{
                        confirmationStatus:true
                    }
                },
                _count:{
                    select:{
                        guests:{
                        where:{
                            confirmationStatus:{in:["ATTENDING","HOST"]}
                        }
                        }
                    }
                }

            }
        });
    }
    async getEventsByNameOrDescriptionAndUserId(input: string, userId: number){
        const keywords = input.split(' ');

        const keywordConditions = keywords.map(keyword => ({
            OR: [
                { name: { contains: keyword } },
                { description: { contains: keyword } }
            ]
        }));
        return this.prisma.event.findMany({
            where:{
                OR:[
                    ...keywordConditions
                ],
                AND:[
                    { OR: [{ creatorId: userId }, { guests: { some: { userId: userId } } }] }

                ]
            },
            select:{
                name:true,
                description:true,
                coordinates:true,
                date:true,
                guests:{
                    where:{
                        userId:userId
                    },
                    select:{
                        confirmationStatus:true
                    }
                },
                _count:{
                    select:{
                        guests:{
                            where:{
                                confirmationStatus:{in:["ATTENDING","HOST"]}
                            }
                        }
                    }
                }
            }
        })

    }


    async inviteGuest(eventId: number, invitedId: number) {
        return this.prisma.guest.create({
            data: {
                userId: invitedId,
                eventId: eventId,
                confirmationStatus: "PENDING",
            },
        } );
    }


    async answerInvite(guestId: number, answer: confirmationStatus) {
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
    async getInvitesByUser(userId: number) {
        return this.prisma.guest.findMany({
            where: {
                userId: userId,
            },
        });
    }

    getGuest(guestId: number) {
        return this.prisma.guest.findUnique({
            where:{
                id: guestId,
            },
        });
    }

    getGuestsByEvent(eventId: number) {
        return this.prisma.guest.findMany({
            where:{
                eventId: eventId,
            },
        });
    }

    getHostGuest(eventId: number, userId: number) {
        return this.prisma.guest.findUnique({
            where:{
                userId_eventId: {userId, eventId},
                confirmationStatus: "HOST",
            },
        });
    }
}
