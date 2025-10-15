import { IsNumber } from 'class-validator';

export class AssignBedDto {
  @IsNumber()
  bedId: number;
}
