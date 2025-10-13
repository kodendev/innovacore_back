import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBedMenuDto } from './dto/create-bed-menu.dto';
import { BedMenu } from './entities/bed-menu.entity';
import { Bed } from 'src/beds/entities/bed.entity';
import { Menu } from 'src/inventory/entities/menu.entity';
import { ConsumeBedMenuDto } from './dto/consume-bed-menu.dto';
import { ProductService } from '../inventory/services/products.service';

@Injectable()
export class BedMenuService {
  constructor(
    @InjectRepository(BedMenu)
    private readonly bedMenuRepo: Repository<BedMenu>,

    @InjectRepository(Bed)
    private readonly bedRepo: Repository<Bed>,

    @InjectRepository(Menu)
    private readonly menuRepo: Repository<Menu>,

    private readonly productService: ProductService,
  ) {}

  async assignMenu(dto: CreateBedMenuDto): Promise<BedMenu> {
    const bed = await this.bedRepo.findOne({ where: { id: dto.bedId } });
    if (!bed) throw new NotFoundException('Bed not found');

    const menu = await this.menuRepo.findOne({ where: { id: dto.menuId } });
    if (!menu) throw new NotFoundException('Menu not found');

    const bedMenu = this.bedMenuRepo.create({
      bedId: dto.bedId,
      menuId: dto.menuId,
      quantity: dto.quantity || 1,
    });

    return this.bedMenuRepo.save(bedMenu);
  }

  async findAll(): Promise<BedMenu[]> {
    return this.bedMenuRepo.find({ relations: ['bed', 'menu'] });
  }

  async markConsumed(id: number): Promise<BedMenu> {
    const bedMenu = await this.bedMenuRepo.findOne({ where: { id } });
    if (!bedMenu) throw new NotFoundException('Assignment not found');

    bedMenu.consumed = true;
    return this.bedMenuRepo.save(bedMenu);
  }

  async consumeBedMenu(dto: ConsumeBedMenuDto) {
    const { bedMenuId, quantity, userId } = dto;

    // 1. Buscar el BedMenu y su menú asociado con los productos
    const bedMenu = await this.bedMenuRepo.findOne({
      where: { id: bedMenuId },
      relations: ['menu', 'menu.menuProducts', 'menu.menuProducts.product'],
    });

    if (!bedMenu) {
      throw new Error('BedMenu no encontrado');
    }

    // 2. Expandir los productos según la cantidad del menú
    const productsToConsume = bedMenu.menu.menuProducts.map((mp) => ({
      productId: mp.productId,
      quantity: mp.quantity * quantity, // multiplicamos por la cantidad que queremos consumir
    }));

    // 3. Llamamos al service de productos que ya existe
    await this.productService.addBedConsumptionMovement({
      userId,
      products: productsToConsume,
    });

    // 4. Marcar el bedMenu como consumido si es necesario
    bedMenu.consumed = true;
    await this.bedMenuRepo.save(bedMenu);

    return { success: true, message: 'Stock consumido correctamente' };
  }
}
