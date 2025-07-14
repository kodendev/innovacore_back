import { IsString } from "class-validator";

export class CreateMenuTypesDto {
    @IsString()
    name: string
}