import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInventoryDto {
  @ApiProperty({
    example: 10,
    description: 'ID del producto en inventario',
  })
  @IsInt()
  productId: number;

  @ApiProperty({
    example: 2,
    description: 'ID del tipo de movimiento (por ejemplo, entrada o salida)',
  })
  @IsInt()
  movementTypeId: number;

  @ApiProperty({
    example: 50,
    description: 'Cantidad de unidades que se mueven en la operación',
  })
  @IsInt()
  quantity: number;
}
