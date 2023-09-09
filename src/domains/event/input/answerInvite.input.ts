import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { confirmationStatus } from '@prisma/client';

export class answerInviteInput {
  @IsNumber()
  @IsNotEmpty()
  guestId: number;
  @IsNotEmpty()
  @IsEnum(confirmationStatus)
  answer: confirmationStatus;
}
