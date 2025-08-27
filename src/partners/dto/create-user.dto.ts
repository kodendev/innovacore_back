import {
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsOptional,
  IsNumber,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'gonzalo123',
    description: 'Nombre de usuario único',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    example: 'MiPasswordSegura123!',
    description: 'Hash de la contraseña',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'ID del socio/partner, opcional',
  })
  @IsOptional()
  @IsNumber()
  partnerId?: number;

  @ApiProperty({ example: 2, description: 'ID del tipo de usuario' })
  @IsNumber()
  userTypeId: number;

  @ApiProperty({ example: true, description: 'Estado activo del usuario' })
  @IsBoolean()
  active: boolean;

  @ApiProperty({
    example: 'correo@ejemplo.com',
    description: 'Correo electrónico del usuario',
  })
  @IsString()
  @IsNotEmpty()
  email: string;
}
