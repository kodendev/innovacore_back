import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Room } from './entities/room.entity';
import { RoomFilterDto } from './dto/room-filter.dto';

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

  @Get('overview')
  @ApiOperation({
    summary:
      'Obtener vista general de habitaciones con camas y menús asignados (ideal para el trackeo)',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de habitaciones con camas y menús asignados',
    type: [Room],
    isArray: true,
  })
  async getRoomsOverview() {
    return this.roomsService.getRoomsOverview();
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener todas las habitaciones con su menú mas reciente/activo',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de habitaciones con su menú más reciente/activo',
    type: [Room],
    isArray: true,
  })
  findAll() {
    return this.roomsService.findAll();
  }

  @Get('filters')
  @ApiOperation({ summary: 'Obtener habitaciones con filtros avanzados' })
  @ApiResponse({
    status: 200,
    description: 'Lista de habitaciones filtradas',
    type: [Room],
    isArray: true,
  })
  async findWithFilters(@Query() filters: RoomFilterDto) {
    return this.roomsService.findWithFilters(filters);
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
