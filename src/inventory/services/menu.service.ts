import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Menu } from '../entities/menu.entity';
import { CreateMenuDto } from '../dto/create-menu.dto';
import { MenuProductService } from './menu_product.service';


interface MenuProductInterface {
  menuId: number,
  productId: number
}


@Injectable()
export class MenuService {
  private readonly logger = new Logger(MenuService.name);

  constructor(
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
    private readonly menuProductService: MenuProductService
  ) { }

  async create(createMenuDto: CreateMenuDto): Promise<Menu> {
    this.logger.log(`Creating menu: ${JSON.stringify(createMenuDto)}`);

    // 1. Crear la entidad Menu sin los productos
    const { menuProducts, ...menuData } = createMenuDto;
    const menu = this.menuRepository.create(menuData);

    // 2. Guardar el menú primero para obtener el ID
    const savedMenu = await this.menuRepository.save(menu);

    // 3. Crear los MenuProducts relacionados
    if (menuProducts && menuProducts.length > 0) {
      // Mapear para crear promesas de creación
      const createMenuProductsPromises = menuProducts.map(mp => {
        return this.menuProductService.create({
          menuId: savedMenu.id,
          productId: mp.productId,
          quantity: mp.quantity,
        });
      });

      // Esperar a que terminen todas las creaciones
      await Promise.all(createMenuProductsPromises);
    }

    // 4. Retornar el menú guardado
    return savedMenu;
  }
  async findAll() {
    this.logger.log('Fetching all menus');
    return await this.menuRepository.find();
  }
}
