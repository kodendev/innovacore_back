import {
  IsBoolean,
  IsString,
  IsNumber,
  IsPositive,
  Min,
  IsDateString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({
    example: 'Coca Cola 500ml',
    description: 'Nombre del producto',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: '2023-12-31',
    description: 'Fecha de caducidad del producto',
  })
  @ApiProperty({
    example: 'Bebida gaseosa sabor cola',
    description: 'Descripción breve del producto',
  })
  @IsString()
  description: string;

  @ApiProperty({
    example: 1,
    description: 'ID de la categoría del producto',
  })
  @IsNumber()
  @IsPositive()
  categoryId: number;

  @ApiProperty({
    example: 250,
    description: 'Precio de venta al público (ARS)',
  })
  @IsNumber()
  @IsPositive()
  sale_price: number;

  @ApiProperty({
    example: 150,
    description: 'Costo de adquisición o fabricación del producto (ARS)',
  })
  @IsNumber()
  @IsPositive()
  cost_price: number;

  @ApiProperty({
    example: '7790895001234',
    description: 'Código de barras del producto',
  })
  @IsString()
  barcode: string;

  @ApiProperty({
    example: true,
    description: 'Indica si el producto está activo para la venta',
  })
  @IsBoolean()
  active: boolean;

  @ApiProperty({
    example: 100,
    description: 'Cantidad actual en stock. Debe ser 0 o mayor.',
  })
  @IsNumber()
  @Min(0)
  stock: number;

  @ApiProperty({
    example: '2023-12-31',
    description: 'Fecha de caducidad del producto',
  })
  @IsString()
  @IsDateString()
  expirationDate: string;
}
