import {
  Guest,
  Event,
  Prisma,
  $Enums,
  confirmationStatus,
} from '@prisma/client';

export class EventInfoOutputDto {
  name: string;
  description: string;
  coordinates: Number[];
  date: Date;
  confirmationDeadline: Date;
  confirmationStatus: confirmationStatus;
  guests: number;
}
