import { IsInt, IsPositive } from "class-validator";

export class CreateMenuProductItemDto {
    @IsInt()
    @IsPositive()
    productId: number;

    @IsInt()
    @IsPositive()
    quantity: number;
}
