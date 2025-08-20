import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserTypeDto {
  @ApiProperty({ example: 'Admin', description: 'Nombre del tipo de usuario' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Usuarios con privilegios de administración',
    description: 'Descripción del tipo de usuario',
  })
  @IsString()
  @IsNotEmpty()
  description: string;
}
