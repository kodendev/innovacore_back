import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { MenuService } from '../services/menu.service';
import { CreateMenuDto } from '../dto/create-menu.dto';
import { MenuTypeService } from '../services/menu_type.service';
import { CreateMenuTypesDto } from '../dto/create-menu-types.dto';
import { ConsumeMenuDto } from '../dto/consume-menu.dto';
import { UpdateMenuDto } from '../dto/update-menu.dto';

@ApiTags('Menu')
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo menú' })
  @ApiResponse({
    status: 201,
    description: 'El menú fue creado correctamente',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos en el cuerpo de la solicitud',
  })
  create(@Body() createMenuDto: CreateMenuDto) {
    return this.menuService.create(createMenuDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los menús' })
  @ApiResponse({
    status: 200,
    description: 'Lista de menús',
  })
  findAll() {
    return this.menuService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un menú por ID' })
  @ApiResponse({
    status: 200,
    description: 'Menú encontrado',
  })
  findOne(@Param('id') id: number) {
    return this.menuService.findOne(Number(id));
  }

  @Patch('add-quantity')
  @ApiOperation({ summary: 'Agregar cantidad a un menú existente' })
  @ApiResponse({
    status: 200,
    description: 'Cantidad agregada correctamente al menú',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos en el cuerpo de la solicitud',
  })
  @ApiResponse({
    status: 404,
    description: 'Menú no encontrado',
  })
  addQuantityMenu(@Body() consumeMenuDto: ConsumeMenuDto) {
    const { menuId, quantity } = consumeMenuDto;
    return this.menuService.addQuantityMenu(menuId, quantity);
  }

  @Post('consume')
  @ApiOperation({ summary: 'Consumir una cantidad específica de un menú' })
  @ApiResponse({
    status: 200,
    description: 'Menú consumido correctamente',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o cantidad insuficiente',
  })
  @ApiResponse({
    status: 404,
    description: 'Menú no encontrado',
  })
  consumeMenu(@Body() consumeMenuDto: ConsumeMenuDto) {
    return this.menuService.consumeMenu(consumeMenuDto);
  }

  //Actualizar campos de un menú sin productos
  @Put(':id')
  @ApiOperation({
    summary: 'Actualizar datos básicos de un menú (sin productos)',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del menú a actualizar',
    type: Number,
  })
  @ApiBody({ type: UpdateMenuDto })
  @ApiResponse({ status: 200, description: 'Menú actualizado correctamente' })
  @ApiResponse({ status: 404, description: 'Menú no encontrado' })
  updateMenu(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMenuDto: UpdateMenuDto,
  ) {
    return this.menuService.updateMenuBasicInfo(id, updateMenuDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un menú' })
  @ApiParam({ name: 'id', description: 'ID del menú a eliminar' })
  @ApiResponse({
    status: 200,
    description: 'Menú eliminado correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Menú no encontrado',
  })
  remove(@Param('id') id: number) {
    return this.menuService.remove(Number(id));
  }

  @Get('type/:menuTypeId')
  @ApiOperation({ summary: 'Obtener menús por tipo' })
  @ApiParam({ name: 'menuTypeId', description: 'ID del tipo de menú' })
  @ApiResponse({
    status: 200,
    description: 'Lista de menús del tipo especificado',
  })
  findByMenuType(@Param('menuTypeId') menuTypeId: number) {
    return this.menuService.findByMenuType(Number(menuTypeId));
  }

  @Get(':id/with-products')
  @ApiOperation({ summary: 'Obtener un menú con sus productos asociados' })
  @ApiParam({ name: 'id', description: 'ID del menú' })
  @ApiResponse({
    status: 200,
    description: 'Menú con productos encontrado',
  })
  @ApiResponse({
    status: 404,
    description: 'Menú no encontrado',
  })
  findWithProducts() {
    return this.menuService.findWithProducts();
  }

  @Get('all/with-products')
  @ApiOperation({
    summary: 'Obtener todos los menús con sus productos asociados',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de todos los menús con sus productos',
  })
  findAllWithProducts() {
    return this.menuService.findAllWithProducts();
  }

  @Get('available/list')
  @ApiOperation({ summary: 'Obtener menús disponibles (con stock > 0)' })
  @ApiResponse({
    status: 200,
    description: 'Lista de menús disponibles para consumo',
  })
  findAvailableMenus() {
    return this.menuService.findAvailableMenus();
  }

  @Patch(':id/changeStatus') //usamos patch por que cambiaremos parcialmente el recurso
  @ApiOperation({ summary: 'Cambiar el estado activo/inactivo de un menú' })
  @ApiResponse({
    status: 200,
    description: 'Estado del menú cambiado correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Menú no encontrado',
  })
  changeMenuStatus(@Param('id', ParseIntPipe) id: number) {
    return this.menuService.changeMenuStatus(id);
  }
}

@ApiTags('Menu Types')
@Controller('menuType')
export class MenuTypeController {
  constructor(private readonly menuTypeService: MenuTypeService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo tipo de menú' })
  @ApiResponse({
    status: 201,
    description: 'El tipo de menú fue creado correctamente',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos en el cuerpo de la solicitud',
  })
  create(@Body() createMenuTypesDto: CreateMenuTypesDto) {
    return this.menuTypeService.create(createMenuTypesDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los tipos de menú' })
  @ApiResponse({
    status: 200,
    description: 'Lista de tipos de menú',
  })
  findAll() {
    return this.menuTypeService.findAll();
  }
}
