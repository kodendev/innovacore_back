import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BedMenuService } from './bed-menu.service';
import { BedMenuController } from './bed-menu.controller';
import { BedMenu } from './entities/bed-menu.entity';
import { Bed } from 'src/beds/entities/bed.entity';
import { Menu } from 'src/inventory/entities/menu.entity';
import { InventoryModule } from 'src/inventory/inventory.module';

@Module({
  imports: [TypeOrmModule.forFeature([BedMenu, Bed, Menu]), InventoryModule],
  providers: [BedMenuService],
  controllers: [BedMenuController],
})
export class BedMenuModule {}
