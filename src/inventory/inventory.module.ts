import { Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { ProductController } from './cotrollers/products.controller';
import { ProductService } from './services/products.service';
import { Product } from './entities/products.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [InventoryController, ProductController],
  providers: [InventoryService, ProductService],
})
export class InventoryModule { }
