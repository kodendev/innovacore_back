import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsPositive } from "class-validator";

export class ConsumeMenuDto {
    @ApiProperty({
        example: 1,
        description: "Id del menu a consumir",
    })
    @IsNumber()
    @IsPositive()
    menuId: number

    @ApiProperty({
        example: 1,
        description: "Cantidad de menus a consumir",
        default: 1,
    })
    @IsNumber()
    @IsPositive()
    quantity: 1
}