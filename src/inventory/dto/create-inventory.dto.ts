import { IsInt, IsPositive } from 'class-validator';

export class CreateInventoryDto {
    @IsInt()
    productId: number;

    @IsInt()
    movementTypeId: number;

    @IsInt()
    quantity: number;
}
