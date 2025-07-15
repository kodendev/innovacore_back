import { Type } from "class-transformer";
import {
    ValidateNested,
    IsArray,
    IsString,
    IsNumber,
    IsPositive,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { CreateMenuProductItemDto } from "./CreateMenuProductItem.dto";

export class CreateMenuDto {
    @ApiProperty({
        example: 1,
        description: "Cantidad de menús disponibles",
    })
    @IsNumber()
    @IsPositive()
    quantity: number;

    @ApiProperty({
        example: "Menú Ejecutivo",
        description: "Nombre del menú",
    })
    @IsString()
    name: string;

    @ApiProperty({
        example: "Incluye plato principal, bebida y postre",
        description: "Descripción del menú",
    })
    @IsString()
    description: string;

    @ApiProperty({
        example: 2,
        description: "ID del tipo de menú (relación con MenuType)",
    })
    @IsNumber()
    @IsPositive()
    menuTypeId: number;

    @ApiProperty({
        type: [CreateMenuProductItemDto],
        description: "Lista de productos que componen el menú",
        example: [
            { productId: 1, quantity: 2 },
            { productId: 3, quantity: 1 },
        ],
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateMenuProductItemDto)
    menuProducts: CreateMenuProductItemDto[];
}
