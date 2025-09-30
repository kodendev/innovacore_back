import { ApiProperty } from '@nestjs/swagger';

export class UpdateSupplierDto {
  @ApiProperty({
    example: 'Proveedor ACME',
    description: 'Nombre del proveedor',
  })
  name: string;

  @ApiProperty({
    example: 'acme@email.com',
    description: 'Correo electrónico del proveedor',
  })
  email: string;

  @ApiProperty({
    example: '123456789',
    description: 'Teléfono de contacto',
  })
  phone: string;

  @ApiProperty({
    example: 'calle falsa 123',
    description: 'Dirección  del proveedor',
  })
  address: string;
}
