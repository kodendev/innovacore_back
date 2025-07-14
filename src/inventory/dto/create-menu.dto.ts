

import { Type } from "class-transformer";
import { ValidateNested, IsArray, IsString, IsNumber, IsPositive, Min } from "class-validator";
import { CreateMenuProductItemDto } from "./CreateMenuProductItem.dto";

export class CreateMenuDto {
    @IsNumber()
    @IsPositive()
    quantity: number;

    @IsString()
    name: string;

    @IsString()
    description: string;

    @IsNumber()
    @IsPositive()
    menuTypeId: number;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateMenuProductItemDto)
    menuProducts: CreateMenuProductItemDto[];
}
