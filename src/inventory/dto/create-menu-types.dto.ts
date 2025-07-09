import { IsString } from "class-validator";

export class CreateMenuTypes {
    @IsString()
    name: string
}