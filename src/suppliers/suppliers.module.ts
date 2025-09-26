import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SuppliersController } from './suppliers.controller';
import { SuppliersService } from './suppliers.service';
import { Supplier } from './entities/supplier.entity';
import { SupplierProduct } from './entities/supplier-product.entity';
import { Product } from 'src/inventory/entities/products.entity';
import { SupplierProductsService } from './suppliers-products.service';
import { SupplierProductsController } from './suppliers-product.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Supplier, SupplierProduct, Product])],
  controllers: [SuppliersController, SupplierProductsController],
  providers: [SuppliersService, SupplierProductsService],
  exports: [SuppliersService, SupplierProductsService],
})
export class SuppliersModule {}
