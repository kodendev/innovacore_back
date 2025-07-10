import { IsBoolean, IsString, IsNumber, IsPositive, Min, IsOptional } from 'class-validator';

export class UpdateProductDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    sale_price?: number;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    cost_price?: number;

    @IsOptional()
    @IsString()
    barcode?: string;

    @IsOptional()
    @IsBoolean()
    active?: boolean;

    @IsOptional()
    @IsNumber()
    @Min(0)
    stock?: number;
}
