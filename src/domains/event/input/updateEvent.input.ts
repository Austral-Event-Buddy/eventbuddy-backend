import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class updateEventInput {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  coordinates: number[];

  @IsOptional()
  @IsDateString()
  confirmationDeadline: Date;

  @IsOptional()
  @IsDateString()
  date: Date;
}
