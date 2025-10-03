import {
  IsBoolean,
  IsString,
  IsNumber,
  IsPositive,
  Min,
  IsOptional,
  IsDateString,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProductDto {
  @ApiPropertyOptional({
    example: 'Coca Cola 500ml',
    description: 'Nombre del producto',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    example: 'Bebida gaseosa sabor cola',
    description: 'Descripción breve del producto',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'Categoria del producto',
  })
  @IsOptional()
  @IsNumber()
  categoryId?: number;

  @ApiPropertyOptional({
    example: 250,
    description: 'Precio de venta al público (ARS)',
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  sale_price?: number;

  @ApiPropertyOptional({
    example: 150,
    description: 'Costo de adquisición o fabricación del producto (ARS)',
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  cost_price?: number;

  @ApiPropertyOptional({
    example: '7790895001234',
    description: 'Código de barras del producto',
  })
  @IsOptional()
  @IsString()
  barcode?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Indica si el producto está activo para la venta',
  })
  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @ApiPropertyOptional({
    example: 100,
    description: 'Cantidad actual en stock. Debe ser 0 o mayor.',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number;

  @ApiPropertyOptional({
    example: '2023-12-31',
    description: 'Fecha de caducidad del producto',
  })
  @IsOptional()
  @IsDateString()
  expirationDate?: string;

  @ApiPropertyOptional({
    example: 0,
    description: 'Stock mínimo del producto',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minStock?: number;
}
