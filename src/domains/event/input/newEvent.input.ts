import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class NewEventInput {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsArray()
  @IsNotEmpty()
  @IsNumber({}, { each: true })
  coordinates: number[];

  @IsNotEmpty()
  @IsDateString()
  confirmationDeadline: Date;

  @IsNotEmpty()
  @IsDateString()
  date: Date;
}
