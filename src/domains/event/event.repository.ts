import {PrismaService} from '../../prisma/prisma.service';
import {Injectable} from '@nestjs/common';
import {PrismaClient} from "@prisma/client";

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
        return this.prisma.event.findMany({
            where:{
                OR:[
                    {name:{contains:input}},
                    {description:{contains:input}},
                    {creatorId:userId},
                    {guests:{some:{userId:userId}}}
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




}
