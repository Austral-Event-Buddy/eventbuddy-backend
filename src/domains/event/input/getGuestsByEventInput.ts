import { IsNotEmpty, IsNumber } from 'class-validator';

export class getGuestsByEventInput {
  @IsNotEmpty()
  @IsNumber()
  eventId: number;
}
