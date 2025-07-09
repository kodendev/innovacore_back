import { IsBoolean, IsString, IsNumber, IsPositive, Min } from "class-validator"


export class CreateProductDto {
    @IsString()
    name: string

    @IsString()
    description: string

    @IsNumber()
    @IsPositive()
    sale_price: number

    @IsNumber()
    @IsPositive()
    cost_price: number

    @IsString()
    barcode: string

    @IsBoolean()
    active: boolean

    @IsNumber()
    @Min(0)
    stock: number


}