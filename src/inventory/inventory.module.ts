import { Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { ProductController } from './controllers/products.controller';
import { ProductService } from './services/products.service';
import { Product } from './entities/products.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Menu } from './entities/menu.entity';
import {
  MenuController,
  MenuTypeController,
} from './controllers/menu.controller';
import { MenuService } from './services/menu.service';
import { MenuTypeService } from './services/menu_type.service';
import { MenuType } from './entities/menu_types.entity';
import { MenuProductService } from './services/menu_product.service';
import { MenuProduct } from './entities/menu_product.entity';
import { Inventory } from './entities/inventory.entity';
import { MovementType } from './entities/movementType.entity';
import { User } from 'src/partners/entities/user.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      Menu,
      MenuType,
      MenuProduct,
      Inventory,
      MovementType,
      User,
    ]),
  ],
  controllers: [
    InventoryController,
    ProductController,
    MenuController,
    MenuTypeController,
    InventoryController,
  ],
  providers: [
    InventoryService,
    ProductService,
    MenuService,
    MenuTypeService,
    MenuProductService,
    InventoryService,
  ],
})
export class InventoryModule {}
