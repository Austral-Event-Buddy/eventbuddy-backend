import {IsDate, IsNotEmpty} from "class-validator";

export class getPassedEventsInput {
  @IsNotEmpty()
  @IsDate()
  date: Date;
}