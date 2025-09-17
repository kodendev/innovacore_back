import { ApiProperty } from '@nestjs/swagger';

export class PurchaseProductDto {
  @ApiProperty({
    description: 'ID del producto que se va a comprar',
    example: 1,
  })
  productId: number;

  @ApiProperty({
    description: 'Cantidad de producto a comprar',
    example: 10,
  })
  quantity: number;
}

export class MovementDto {
  @ApiProperty({
    description: 'ID del usuario que realiza la compra',
    example: 5,
  })
  userId: number;

  @ApiProperty({
    description: 'Lista de productos a comprar',
    type: [PurchaseProductDto],
  })
  products: PurchaseProductDto[];
}

export class AddSaleDto {
  @ApiProperty({
    description: 'ID del usuario que realiza la venta',
    example: 5,
  })
  userId: number;

  @ApiProperty({
    description: 'Lista de productos a vender',
    type: [PurchaseProductDto],
  })
  products: PurchaseProductDto[];
}
