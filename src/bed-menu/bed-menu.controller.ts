import { Controller, Post, Body, Get, Param, Patch } from '@nestjs/common';
import { BedMenuService } from './bed-menu.service';
import { CreateBedMenuDto } from './dto/create-bed-menu.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BedMenu } from './entities/bed-menu.entity';
import { ConsumeBedMenuDto } from './dto/consume-bed-menu.dto';

@ApiTags('Asignación de Menús a Camas')
@Controller('bed-menu')
export class BedMenuController {
  constructor(private readonly bedMenuService: BedMenuService) {}

  @Post('assign')
  @ApiOperation({ summary: 'Asignar un menú a una cama' })
  @ApiResponse({
    status: 201,
    description: 'Menú asignado correctamente',
    type: BedMenu,
  })
  assignMenu(@Body() dto: CreateBedMenuDto) {
    return this.bedMenuService.assignMenu(dto);
  }

  @Post('consume')
  @ApiOperation({ summary: 'Consumir un menú asignado a una cama' })
  @ApiResponse({ status: 200, description: 'Stock consumido correctamente' })
  @ApiResponse({ status: 400, description: 'Error al consumir el menú' })
  async consumeBedMenu(@Body() dto: ConsumeBedMenuDto) {
    return this.bedMenuService.consumeBedMenu(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las asignaciones de menú a camas' })
  @ApiResponse({ status: 200, type: [BedMenu] })
  findAll() {
    return this.bedMenuService.findAll();
  }

  @Patch(':id/consume')
  @ApiOperation({ summary: 'Marcar un menú asignado como consumido' })
  @ApiResponse({
    status: 200,
    description: 'Asignación marcada como consumida',
    type: BedMenu,
  })
  consume(@Param('id') id: number) {
    return this.bedMenuService.markConsumed(Number(id));
  }
}
