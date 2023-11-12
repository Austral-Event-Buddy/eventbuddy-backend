import {IsDate, IsDateString, IsNotEmpty} from "class-validator";

export class getPassedEventsInput {
  @IsNotEmpty()
  @IsDateString()
  date: string;
}