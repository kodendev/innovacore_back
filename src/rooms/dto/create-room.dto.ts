import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsIn,
} from 'class-validator';

export class CreateRoomDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsOptional()
  floor?: number;

  @IsIn(['active', 'inactive'])
  @IsOptional()
  status?: 'active' | 'inactive';
}
