import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class RoomFilterDto {
  @ApiPropertyOptional({
    description: 'Estado de la habitación',
    enum: ['active', 'inactive'],
  })
  readonly roomStatus?: string;

  @ApiPropertyOptional({ description: 'Piso de la habitación' })
  @Type(() => Number)
  readonly floor?: number;

  @ApiPropertyOptional({
    description: 'Estado de la cama',
    enum: ['mantenimiento', 'ocupada', 'disponible'],
  })
  readonly bedStatus?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por consumo de menú asignado',
    type: Boolean,
  })
  @Type(() => Boolean)
  readonly menuConsumed?: boolean;

  @ApiPropertyOptional({ description: 'ID del menú asignado' })
  @Type(() => Number)
  readonly menuId?: number;

  @ApiPropertyOptional({ description: 'Nombre de la habitación' })
  readonly name?: string;
}
