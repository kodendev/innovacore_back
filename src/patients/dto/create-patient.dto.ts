import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreatePatientDto {
  @ApiProperty({ example: 'Juan Pérez' })
  @IsString()
  name: string;

  @ApiProperty({ example: '12345678', required: false })
  @IsOptional()
  @IsString()
  documentNumber?: string;

  @ApiProperty({ example: 45 })
  @IsInt()
  age: number;

  @ApiProperty({ example: 'Fractura de tibia', required: false })
  @IsOptional()
  @IsString()
  diagnosis?: string;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsInt()
  bedId?: number;
}
