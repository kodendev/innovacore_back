import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BedsService } from './beds.service';
import { CreateBedDto } from './dto/create-bed.dto';
import { UpdateBedDto } from './dto/update-bed.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Bed } from './entities/bed.entity';

@ApiTags('Camas')
@Controller('beds')
export class BedsController {
  constructor(private readonly bedsService: BedsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva cama' })
  @ApiResponse({
    status: 201,
    description: 'Cama creada correctamente',
    type: Bed,
  })
  @ApiBody({
    description: 'Datos para crear una cama',
    type: CreateBedDto,
    examples: {
      ejemplo1: {
        summary: 'Cama estándar',
        value: { name: 'Cama 1', roomId: 1, status: 'disponible' },
      },
    },
  })
  create(@Body() createBedDto: CreateBedDto) {
    return this.bedsService.create(createBedDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las camas' })
  @ApiResponse({
    status: 200,
    description: 'Lista de camas',
    type: [Bed],
    isArray: true,
  })
  findAll() {
    return this.bedsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una cama por ID' })
  @ApiResponse({
    status: 200,
    description: 'Cama encontrada',
    type: Bed,
  })
  findOne(@Param('id') id: string) {
    return this.bedsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una cama' })
  @ApiResponse({
    status: 200,
    description: 'Cama actualizada correctamente',
    type: Bed,
  })
  @ApiBody({
    description: 'Datos a actualizar',
    type: UpdateBedDto,
    examples: {
      ejemplo1: {
        summary: 'Actualizar nombre, habitación o estado',
        value: { name: 'Cama 2', roomId: 1, status: 'ocupada' },
      },
    },
  })
  update(@Param('id') id: string, @Body() updateBedDto: UpdateBedDto) {
    return this.bedsService.update(+id, updateBedDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una cama' })
  @ApiResponse({ status: 200, description: 'Cama eliminada correctamente' })
  @ApiResponse({ status: 404, description: 'Cama no encontrada' })
  remove(@Param('id') id: string) {
    return this.bedsService.remove(+id);
  }
}
