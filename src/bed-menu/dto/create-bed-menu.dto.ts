import { ApiProperty } from '@nestjs/swagger';

export class CreateBedMenuDto {
  @ApiProperty({ example: 1 })
  bedId: number;

  @ApiProperty({ example: 2 })
  menuId: number;

  @ApiProperty({ example: 1, required: false })
  quantity?: number;
}
