import { IsString, IsOptional, IsNumber } from 'class-validator';

export class AddStatusDto {
  @IsString()
  statusType: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsNumber()
  userId?: number; // usuario que actualiza el estado
}
