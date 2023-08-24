import { PrismaService } from '../../prisma/prisma.service';

export class EventRepository {
  constructor(private prisma: PrismaService) {}
}
