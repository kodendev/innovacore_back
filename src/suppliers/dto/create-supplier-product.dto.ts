import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsPositive } from 'class-validator';

export class CreateSupplierProductDto {
  @ApiProperty({ example: 21, description: 'productId' })
  @IsInt()
  productId: number;

  @ApiProperty({
    example: 150.5,
    description: 'Precio de costo que ofrece el proveedor',
  })
  @IsNumber()
  @IsPositive()
  costPrice: number;
}
