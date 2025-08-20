import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { UserTypeService } from '../services/userType.service';
import { CreateUserTypeDto } from '../dto/create-userType.dto';
import { UpdateUserTypeDto } from '../dto/update-userType.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { UserType } from '../entities/userType.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

@ApiTags('user-types')
@Controller('user-types')
export class UserTypeController {
  constructor(private readonly userTypeService: UserTypeService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo tipo de usuario' })
  @ApiResponse({
    status: 201,
    description: 'Tipo de usuario creado',
    type: UserType,
  })
  @ApiResponse({ status: 400, description: 'UserType ya existe' })
  async create(@Body() createUserTypeDto: CreateUserTypeDto) {
    try {
      return await this.userTypeService.create(createUserTypeDto);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('Error desconocido');
    }
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los tipos de usuario' })
  @ApiResponse({
    status: 200,
    description: 'Lista de tipos de usuario',
    type: [UserType],
  })
  findAll() {
    return this.userTypeService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un tipo de usuario por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Tipo de usuario encontrado',
    type: UserType,
  })
  @ApiResponse({ status: 404, description: 'UserType no encontrado' })
  async findOne(@Param('id') id: number) {
    try {
      return await this.userTypeService.findOne(id);
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException('Error desconocido');
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un tipo de usuario' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Tipo de usuario actualizado',
    type: UserType,
  })
  @ApiResponse({ status: 404, description: 'UserType no encontrado' })
  async update(
    @Param('id') id: number,
    @Body() updateUserTypeDto: UpdateUserTypeDto,
  ) {
    return this.userTypeService.update(id, updateUserTypeDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un tipo de usuario' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Tipo de usuario eliminado' })
  @ApiResponse({ status: 404, description: 'UserType no encontrado' })
  async remove(@Param('id') id: number) {
    return this.userTypeService.remove(id);
  }
}
