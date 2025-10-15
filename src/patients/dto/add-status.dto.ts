import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export enum StatusType {
  DIET = 'diet',
  POST_OP = 'post-op',
  PRE_OP = 'pre-op',
  REVISION = 'revision',
  INTERNACION = 'internacion',
}

export enum DietType {
  LIQUIDA = 'liquida',
  SOLIDA = 'solida',
  BLANDA = 'blanda',
  ENTERAL = 'enteral',
}

export class AddPatientStatusDto {
  @ApiPropertyOptional({
    description: 'Tipo de dieta si statusType es diet',
    enum: DietType,
  })
  @IsOptional()
  @IsEnum(DietType)
  dietType?: DietType;

  @ApiProperty({
    description: 'Tipo de estado',
    enum: ['internacion', 'dieta', 'pre-operatorio', 'post-operatorio'],
  })
  statusType: string;

  @ApiProperty({ description: 'ID del usuario que asigna el estado' })
  @IsNumber()
  userId: number;

  @ApiPropertyOptional({ description: 'Descripción adicional del estado' })
  @IsOptional()
  @IsString()
  description?: string;
}
