import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class InventoryMovementDto {
  @ApiProperty({ description: 'ID del movimiento de stock' })
  id: number;

  @ApiProperty({ description: 'Producto relacionado', type: String })
  productName: string;

  @ApiProperty({ description: 'Cantidad movida (+/-)', example: 5 })
  quantity: number;

  @ApiProperty({
    description: 'Stock final después del movimiento',
    example: 100,
  })
  finalStock: number;

  @ApiProperty({ description: 'Tipo de movimiento', type: String })
  movementType: string;

  @ApiProperty({
    description: 'Usuario que realizó el movimiento',
    type: String,
  })
  userName: string;

  @ApiProperty({ description: 'Motivo del movimiento', required: false })
  reason?: string;

  @ApiProperty({ description: 'Fecha de creación del movimiento' })
  createdAt: Date;
}

export class CreateInventoryMovementDto {
  @ApiProperty({ description: 'ID del producto', example: 1 })
  @IsInt()
  productId: number;

  @ApiProperty({
    description: 'Cantidad movida (+ para ingreso, - para egreso)',
    example: 5,
  })
  @IsInt()
  @Min(1, { message: 'La cantidad debe ser mayor que 0' })
  quantity: number;

  // @ApiProperty({
  //   description: 'ID del tipo de movimiento (ej: INGRESO, EGRESO, CONSUMO)',
  //   example: 1,
  // })
  // @IsInt()
  // movementTypeId: number;
  @ApiProperty({
    description: 'ID del usuario que realiza el movimiento',
    example: 1,
  })
  @IsInt()
  userId: number;

  @ApiProperty({
    description: 'Motivo o descripción del movimiento',
    required: false,
  })
  @IsOptional()
  @IsString()
  reason?: string;
}
