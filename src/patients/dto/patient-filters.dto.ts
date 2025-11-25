// src/patients/dto/patient-filter.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, IsBoolean } from 'class-validator';

export class PatientFilterDto {
  @ApiPropertyOptional({
    description: 'Nombre del paciente',
  })
  @IsOptional()
  @IsString()
  readonly name?: string;

  @ApiPropertyOptional({
    description: 'Tipo de estado del paciente (estado más reciente)',
    enum: ['internacion', 'alta', 'critico', 'observacion'],
  })
  @IsOptional()
  @IsString()
  readonly statusType?: string;

  @ApiPropertyOptional({
    description: 'Número de documento del paciente',
  })
  @IsOptional()
  @IsString()
  readonly documentNumber?: string;

  @ApiPropertyOptional({
    description: 'Estado activo del paciente',
    type: Boolean,
  })
  @Type(() => Boolean)
  @IsOptional()
  @IsBoolean()
  readonly active?: boolean;

  @ApiPropertyOptional({
    description: 'Tipo de dieta del paciente (dieta más reciente)',
    enum: ['liquida', 'solida', 'blanda', 'enteral', 'normal'],
  })
  @IsOptional()
  @IsString()
  readonly dietType?: string;
}
