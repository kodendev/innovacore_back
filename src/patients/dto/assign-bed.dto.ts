import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class AssignBedDto {
  @ApiProperty({ description: 'ID de la cama a asignar', nullable: true })
  @IsOptional()
  @IsNumber()
  bedId?: number | null;
}
