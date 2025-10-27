// dto/consume-bed-menu.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, Min } from 'class-validator';

export class ConsumeBedMenuDto {
  @ApiProperty({ description: 'ID del bedMenu a consumir', example: 1 })
  @IsInt()
  bedMenuId: number;

  @ApiProperty({
    description: 'ID de la cama (opcional pero recomendado para validación)',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsInt()
  bedId?: number;

  @ApiProperty({ description: 'Cantidad de veces a consumir', example: 1 })
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiProperty({
    description: 'ID del usuario que realiza la acción',
    example: 5,
  })
  @IsInt()
  userId: number;
}
