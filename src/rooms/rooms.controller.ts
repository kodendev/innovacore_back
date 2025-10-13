import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Room } from './entities/room.entity';

@ApiTags('Habitaciones')
@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva habitación' })
  @ApiResponse({
    status: 201,
    description: 'Habitación creada correctamente',
    type: Room,
  })
  @ApiBody({
    description: 'Datos para crear una habitación',
    type: CreateRoomDto,
    examples: {
      ejemplo1: {
        summary: 'Habitación básica',
        value: { name: 'Habitación 101', floor: 1 },
      },
    },
  })
  create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomsService.create(createRoomDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las habitaciones' })
  @ApiResponse({
    status: 200,
    description: 'Lista de habitaciones',
    type: [Room],
    isArray: true,
  })
  findAll() {
    return this.roomsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una habitación por ID' })
  @ApiResponse({
    status: 200,
    description: 'Habitación encontrada',
    type: Room,
  })
  @ApiResponse({ status: 404, description: 'Habitación no encontrada' })
  findOne(@Param('id') id: string) {
    return this.roomsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una habitación' })
  @ApiResponse({
    status: 200,
    description: 'Habitación actualizada correctamente',
    type: Room,
  })
  @ApiBody({
    description: 'Datos a actualizar',
    type: UpdateRoomDto,
    examples: {
      ejemplo1: {
        summary: 'Actualizar nombre y piso',
        value: { name: 'Habitación 102', floor: 1 },
      },
    },
  })
  update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
    return this.roomsService.update(+id, updateRoomDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una habitación' })
  @ApiResponse({
    status: 200,
    description: 'Habitación eliminada correctamente',
  })
  @ApiResponse({ status: 404, description: 'Habitación no encontrada' })
  remove(@Param('id') id: string) {
    return this.roomsService.remove(+id);
  }
}
