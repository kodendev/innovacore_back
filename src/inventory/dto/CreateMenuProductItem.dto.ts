import { IsInt, IsPositive } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateMenuProductItemDto {
    @ApiProperty({
        example: 5,
        description: 'ID del producto que se va a incluir en el menú',
    })
    @IsInt()
    @IsPositive()
    productId: number;

    @ApiProperty({
        example: 2,
        description: 'Cantidad de unidades de este producto en el menú (debe ser mayor a 0)',
    })
    @IsInt()
    @IsPositive()
    quantity: number;
}
