// dto/consume-bed-menu.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class ConsumeBedMenuDto {
  @ApiProperty({ description: 'ID del bedMenu a consumir', example: 1 })
  @IsInt()
  bedMenuId: number;

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
