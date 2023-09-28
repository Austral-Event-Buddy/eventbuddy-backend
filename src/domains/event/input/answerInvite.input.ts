import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { confirmationStatus } from '@prisma/client';

export class answerInviteInput {
  @IsNumber()
  @IsNotEmpty()
  eventId: number;
  @IsNotEmpty()
  @IsEnum(confirmationStatus)
  answer: confirmationStatus;
}
