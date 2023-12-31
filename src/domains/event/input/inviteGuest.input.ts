import {IsBoolean, IsNotEmpty, IsNumber} from 'class-validator';

export class inviteGuestInput {
  @IsNotEmpty()
  @IsNumber()
  eventId: number;
  @IsNotEmpty()
  @IsNumber()
  userId: number;
  @IsNotEmpty()
  @IsBoolean()
  isHost: boolean;
}
