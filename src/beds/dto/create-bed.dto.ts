import { IsNotEmpty, IsString, IsIn, IsNumber } from 'class-validator';

export class CreateBedDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsIn(['available', 'occupied', 'maintenance'])
  status?: 'available' | 'occupied' | 'maintenance';

  @IsNumber()
  roomId: number; // Obligatorio, la cama siempre pertenece a una habitación
}
