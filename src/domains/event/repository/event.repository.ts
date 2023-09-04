import { PrismaService } from '../../../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { NewEventInput } from '../input';
import { updateEventInput } from '../input/updateEvent.input';
import { IEventRepository } from './event.repository.interface';

@Injectable()
export class EventRepository implements IEventRepository {
  constructor(private prisma: PrismaService) {}

  async getEventsByUserId(userId: number) {
    return this.prisma.event.findMany({
      where: {
          OR: [{creatorId: userId}, {guests: {some: {userId: userId}}}],
      }
      // },
      // select: {
      //   id: true,
      //   name: true,
      //   description: true,
      //   coordinates: true,
      //   date: true,
      //   confirmationDeadline: true,
      // },
    });
  }

  // async getEventsByUserId(userId: number) {
  //     return this.prisma.event.findMany({
  //         where: {
  //             OR: [
  //                 {creatorId: userId},
  //                 {guests: {some: {userId: userId}}}
  //             ]
  //         },
  //         select: {
  //             name: true,
  //             description: true,
  //             coordinates: true,
  //             date: true,
  //             guests: {
  //                 where: {
  //                     userId: userId
  //                 },
  //                 select: {
  //                     confirmationStatus: true
  //                 }
  //             },
  //             _count: {
  //                 select: {
  //                     guests: {
  //                         where: {
  //                             confirmationStatus: {in: ["ATTENDING", "HOST"]}
  //                         }
  //                     }
  //                 }
  //             }
  //
  //         }
  //     });
  // }
  async countGuestsByEventId(eventId: number) {
    return this.prisma.guest.count({
      where: {
        eventId: eventId,
        confirmationStatus: { in: ['ATTENDING', 'HOST'] },
      },
    });
  }

  async findConfirmationStatus(userId: number, eventId: number) {
    return this.prisma.guest.findUnique({
      where: {
        userId_eventId: { userId, eventId },
      },
      select: {
        confirmationStatus: true,
      },
    });
  }

  async getEventsByNameOrDescriptionAndUserId(userId: number, input: string) {
    const keywords = input.split(' ');

    const keywordConditions = keywords.map((keyword) => ({
      OR: [
        { name: { contains: keyword } },
        { description: { contains: keyword } },
      ],
    }));
    return this.prisma.event.findMany({
      where: {
        OR: [...keywordConditions],
        AND: [
          {
            OR: [
              { creatorId: userId },
              { guests: { some: { userId: userId } } },
            ],
          },
        ],
      }
      // select: {
      //   id: true,
      //   name: true,
      //   description: true,
      //   coordinates: true,
      //   date: true,
      //   confirmationDeadline: true,
      // },
    });
  }

  async getHostGuest(userId: number, eventId: number) {
    return this.prisma.guest.findUnique({
      where: {
        userId_eventId: { userId, eventId },
        confirmationStatus: 'HOST',
      },
    });
  }

  async createEvent(userId: number, input: NewEventInput) {
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
            confirmationStatus: 'HOST',
          },
        },
      },
    });
  }

  async updateEvent(eventId: number, input: updateEventInput) {
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

  async checkIfUserIsCreator(userId: number, eventId: number) {
    return this.prisma.event.findUnique({
      where: {
        id: eventId,
      },
      select: {
        creatorId: true,
      },
    });
  }
  async deleteGuestsFromADeletedEvent(eventId: number) {
    return this.prisma.guest.deleteMany({
      where: {
        eventId: eventId,
      },
    });
  }
  async deleteEventAndGuests(eventId: number) {
    try {
      return await this.prisma.$transaction([
        this.prisma.guest.deleteMany({
          where: {
            eventId: eventId,
          },
        }),
        this.prisma.event.delete({
          where: {
            id: eventId,
          },
        }),
      ]);
    } catch (error) {
      throw new Error(`Error when deleting event: ${error}`);
    }
  }

  async deleteEvent(eventId: number) {
    await this.prisma.guest.deleteMany({
      where: {
        eventId: eventId,
      },
    });
    return this.prisma.event.delete({
      where: {
        id: eventId,
      },
    });
  }
}
