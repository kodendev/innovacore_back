import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'Lácteos',
    description: 'Nombre de la categoría de producto',
  })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({
    example: 1,
    description: 'ID de la categoría padre (opcional)',
    required: false,
  })
  @IsOptional()
  @IsInt()
  parentId?: number;
}
