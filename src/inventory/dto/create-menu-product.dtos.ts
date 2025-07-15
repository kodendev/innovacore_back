import { IsInt, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMenuProductDto {
    @ApiProperty({
        example: 1,
        description: 'ID del menú al que se va a agregar el producto',
    })
    @IsInt()
    menuId: number;

    @ApiProperty({
        example: 5,
        description: 'ID del producto que se va a incluir en el menú',
    })
    @IsInt()
    productId: number;

    @ApiProperty({
        example: 2,
        description: 'Cantidad del producto en el menú (debe ser mayor a 0)',
    })
    @IsInt()
    @IsPositive()
    quantity: number;
}
