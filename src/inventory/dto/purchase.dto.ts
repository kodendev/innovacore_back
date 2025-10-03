import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsPositive,
  Min,
  ValidateNested,
} from 'class-validator';

export class PurchaseProductDto {
  @ApiProperty({
    description: 'ID del producto que se va a comprar',
    example: 1,
  })
  @IsInt({ message: 'El productId debe ser un número entero' })
  @IsPositive({ message: 'El productId debe ser mayor a 0' })
  productId: number;

  @ApiProperty({
    description: 'Cantidad de producto a comprar',
    example: 10,
  })
  @IsInt({ message: 'La cantidad debe ser un número entero' })
  @IsPositive({ message: 'La cantidad debe ser mayor que 0' })
  @Min(1, { message: 'La cantidad debe ser mayor que 0' })
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
  @IsArray({ message: 'Products debe ser un arreglo' })
  @ValidateNested({ each: true })
  @Type(() => PurchaseProductDto)
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
