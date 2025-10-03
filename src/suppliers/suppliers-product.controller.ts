import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { CreateSupplierProductDto } from './dto/create-supplier-product.dto';
import { UpdateSupplierProductDto } from './dto/update-supplier-product.dto';
import { SupplierProductsService } from './suppliers-products.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('supplier-products')
export class SupplierProductsController {
  constructor(private readonly spService: SupplierProductsService) {}

  // Crear relación proveedor-producto
  @Post(':supplierId')
  @ApiOperation({ summary: 'Asociar un producto a un proveedor' })
  addProductToSupplier(
    @Param('supplierId', ParseIntPipe) supplierId: number,
    @Body() dto: CreateSupplierProductDto,
  ) {
    return this.spService.addProductToSupplier(supplierId, dto);
  }

  // Listar todos los productos de un proveedor
  @Get('by-supplier/:supplierId')
  @ApiOperation({ summary: 'Listar productos de un proveedor' })
  listBySupplier(@Param('supplierId', ParseIntPipe) supplierId: number) {
    return this.spService.listBySupplier(supplierId);
  }

  // Listar todos los proveedores que ofrecen un producto
  @Get('by-product/:productId')
  @ApiOperation({ summary: 'Listar proveedores de un producto' })
  listSuppliersByProduct(@Param('productId', ParseIntPipe) productId: number) {
    return this.spService.listSuppliersByProduct(productId);
  }

  // Actualizar precio de costo
  @Patch(':supplierId/:productId')
  @ApiOperation({ summary: 'Actualizar precio de costo' })
  updatePrice(
    @Param('supplierId', ParseIntPipe) supplierId: number,
    @Param('productId', ParseIntPipe) productId: number,
    @Body() dto: UpdateSupplierProductDto,
  ) {
    return this.spService.updatePrice(supplierId, productId, dto);
  }

  // Eliminar (desactivar) un producto de un proveedor
  @Delete(':supplierId/:productId')
  @ApiOperation({ summary: 'Desactivar producto de un proveedor' })
  removeProduct(
    @Param('supplierId', ParseIntPipe) supplierId: number,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return this.spService.removeProduct(supplierId, productId);
  }
}
