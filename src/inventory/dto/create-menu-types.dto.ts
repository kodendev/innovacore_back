import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateMenuTypesDto {
    @ApiProperty({
        example: 'Menú Ejecutivo',
        description: 'Nombre del tipo de menú (por ejemplo: Ejecutivo, Infantil, Vegetariano)',
    })
    @IsString()
    name: string;
}
