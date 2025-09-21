import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Patch,
  Delete,
  ParseIntPipe,
  Query,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { ProductService } from '../services/products.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { MovementDto } from '../dto/purchase.dto';

@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo producto' })
  @ApiResponse({
    status: 201,
    description: 'El producto fue creado correctamente',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos en el cuerpo de la solicitud',
  })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar productos (con filtro opcional por categoría)',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de productos',
  })
  @ApiQuery({
    name: 'categoryId',
    required: false,
    type: Number,
    description: 'ID de la categoría para filtrar los productos',
  })
  findAll(@Query('categoryId') categoryId?: string) {
    return this.productService.findAll(
      categoryId ? Number(categoryId) : undefined,
    );
  }

  @Get('search')
  @ApiOperation({ summary: 'Buscar productos por nombre' })
  @ApiQuery({
    name: 'name',
    type: String,
    description: 'Nombre (o parte del nombre) del producto',
    example: 'shampoo',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de productos encontrados',
  })
  search(@Query('name') name: string) {
    if (!name) {
      throw new BadRequestException('El parámetro "name" es requerido');
    }
    return this.productService.searchByName(name);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un producto por ID' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID del producto',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Datos del producto',
  })
  @ApiResponse({
    status: 404,
    description: 'Producto no encontrado',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar datos de un producto' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID del producto a actualizar',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'El producto fue actualizado correctamente',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos en la solicitud',
  })
  @ApiResponse({
    status: 404,
    description: 'Producto no encontrado',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un producto' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID del producto a eliminar',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'El producto fue eliminado correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Producto no encontrado',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productService.remove(id);
  }
  @Get('stock/min')
  @ApiOperation({ summary: 'Obtener productos con stock mínimo' })
  getProductsWithMinStock() {
    return this.productService.getProductsWithMinStock();
  }

  @Post('addPurchase') // controlador para agregar una compra
  async addPurchase(@Body() movementDto: MovementDto) {
    try {
      return await this.productService.addPurchase(movementDto);
    } catch (error) {
      return { error: error.message };
    }
  }
  @Post('addSaleMovement') // controlador para un movimiento de venta
  async addSale(@Body() movementDto: MovementDto) {
    try {
      return await this.productService.addSaleMovement(movementDto);
    } catch (error) {
      return { error: error.message };
    }
  }
  @Post('addBedConsumptionMovement') // controlador para un movimiento de consumo de cama
  async addBedConsumption(@Body() movementDto: MovementDto) {
    try {
      return await this.productService.addBedConsumptionMovement(movementDto);
    } catch (error) {
      return { error: error.message };
    }
  }
}
