import {PrismaService} from '../../prisma/prisma.service';
import {Injectable} from '@nestjs/common';
import {confirmationStatus, PrismaClient} from "@prisma/client";

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


    async inviteGuest(eventId: number, guestId: number, userId: number) {
        return this.prisma.guest.create({
            data: {
                userId: guestId,
                eventId: eventId,
                confirmationStatus: "PENDING",
            },
        } );
    }


}
