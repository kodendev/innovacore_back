import { IsInt, IsPositive } from 'class-validator';

export class CreateMenuProductDto {
    @IsInt()
    menuId: number;

    @IsInt()
    productId: number;

    @IsInt()
    @IsPositive()
    quantity: number;
}
