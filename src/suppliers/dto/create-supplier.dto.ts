import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateSupplierDto {
  @ApiProperty({
    description: 'Nombre del proveedor',
    example: 'Proveedor de Carnes S.A.',
  })
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  name: string;

  @ApiProperty({
    description: 'Email del proveedor',
    example: 'contacto@carnes.com',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: 'Teléfono del proveedor',
    example: '01112345678',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Length(6, 20)
  phone?: string;

  @ApiProperty({
    description: 'Dirección del proveedor',
    example: 'Calle Falsa 123',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Length(5, 200)
  address?: string;
}
