
import { IsString, IsNumber, IsPositive, Min, isPositive } from "class-validator"

export class CreateMenuDto {
    @IsNumber()
    @Min(0)
    @IsPositive()
    quantity: number;

    @IsString()
    name: string;

    @IsString()
    description: string;
}
