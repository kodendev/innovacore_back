import {
  Injectable,
  Logger,
  NotFoundException,
  InternalServerErrorException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { Menu } from '../entities/menu.entity';
import { CreateMenuDto } from '../dto/create-menu.dto';
import { MenuProductService } from './menu_product.service';
import { ConsumeMenuDto } from '../dto/consume-menu.dto';
import { UpdateMenuDto } from '../dto/update-menu.dto';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface MenuProductInterface {
  menuId: number;
  productId: number;
}

/**
 * Servicio para gestionar los menús del sistema de inventario
 * Permite crear, actualizar, eliminar y consultar menús con sus productos asociados
 */
@Injectable()
export class MenuService {
  private readonly logger = new Logger(MenuService.name);

  constructor(
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
    private readonly menuProductService: MenuProductService,
  ) {}

  /**
   * Crea un nuevo menú con sus productos asociados
   * @param createMenuDto - DTO con los datos del menú y sus productos
   * @returns Promise<Menu> - El menú creado
   */
  async create(createMenuDto: CreateMenuDto): Promise<Menu> {
    this.logger.log(`Creating menu: ${JSON.stringify(createMenuDto)}`);

    const menuNameExists = await this.menuRepository.findOne({
      where: { name: createMenuDto.name },
    });
    if (menuNameExists) {
      throw new ConflictException('Menu with this name already exists');
    }

    // 1. Crear la entidad Menu sin los productos
    const { menuProducts, ...menuData } = createMenuDto;
    const menu = this.menuRepository.create(menuData);

    // 2. Guardar el menú primero para obtener el ID
    const savedMenu = await this.menuRepository.save(menu);

    // 3. Crear los MenuProducts relacionados
    if (menuProducts && menuProducts.length > 0) {
      // Mapear para crear promesas de creación
      const createMenuProductsPromises = menuProducts.map((mp) => {
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

  /**
   * Obtiene todos los menús del sistema
   * @returns Promise<Menu[]> - Lista de todos los menús
   */
  async findAll() {
    this.logger.log('Fetching all menus');
    return await this.menuRepository.find();
  }

  /**
   * Busca un menú específico por su ID
   * @param id - ID del menú a buscar
   * @returns Promise<Menu> - El menú encontrado o null si no existe
   */
  async findOne(id: number) {
    try {
      const menu = await this.menuRepository.findOne({ where: { id } });
      return menu;
    } catch (error) {
      throw new Error(`Error finding menu ${error.message}`);
    }
  }

  /**
   * Agrega cantidad al stock disponible de un menú
   * @param quantity - Cantidad a agregar al stock
   * @param menuId - ID del menú al que agregar cantidad
   * @returns Promise<Menu> - El menú actualizado con la nueva cantidad
   */
  async addQuantityMenu(quantity: number, menuId: number) {
    try {
      const menu = await this.findOne(menuId);
      if (!menu) {
        throw new Error('Menu does not exist');
      }

      // Actualizar la cantidad del menú
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const updatedMenu = await this.menuRepository.update(
        { id: menuId },
        { quantity: menu.quantity + quantity },
      );

      return await this.findOne(menuId);
    } catch (error) {
      this.logger.error(`Error adding quantity to menu: ${error.message}`);
      throw new Error(`Failed to add quantity to menu: ${error.message}`);
    }
  }

  /**
   * Consume una cantidad específica de un menú (reduce el stock disponible)
   * @param consumeMenuDto - DTO con el ID del menú y la cantidad a consumir
   * @returns Promise<Menu> - El menú actualizado después del consumo
   */
  async consumeMenu(consumeMenuDto: ConsumeMenuDto) {
    const { menuId, quantity } = consumeMenuDto;

    try {
      // Verificar que el menú existe
      const menu = await this.findOne(menuId);
      if (!menu) {
        throw new Error('Menu does not exist');
      }

      // Verificar que hay suficiente cantidad disponible
      if (menu.quantity < quantity) {
        throw new Error(
          `Insufficient quantity. Available: ${menu.quantity}, Requested: ${quantity}`,
        );
      }

      // Actualizar la cantidad del menú (restar la cantidad consumida)
      await this.menuRepository.update(
        { id: menuId },
        { quantity: menu.quantity - quantity },
      );

      // Retornar el menú actualizado
      return await this.findOne(menuId);
    } catch (error) {
      this.logger.error(`Error consuming menu: ${error.message}`);
      throw new Error(`Failed to consume menu: ${error.message}`);
    }
  }

  /**
   * Actualiza un menú existente con nuevos datos
   * @param id - ID del menú a actualizar
   * @param updateMenuDto - DTO con los datos a actualizar (parcial)
   * @returns Promise<Menu> - El menú actualizado
   */

  async updateMenuBasicInfo(id: number, dto: UpdateMenuDto): Promise<Menu> {
    const menu = await this.menuRepository.findOne({ where: { id } });
    if (!menu) throw new NotFoundException('Menu not found');

    Object.assign(menu, dto);
    return this.menuRepository.save(menu);
  }

  /**
   * Elimina un menú del sistema
   * @param id - ID del menú a eliminar
   * @returns Promise<void> - No retorna contenido
   */
  async remove(id: number): Promise<void> {
    try {
      const menu = await this.findOne(id);
      if (!menu) {
        throw new Error('Menu does not exist');
      }

      // Eliminar el menú
      await this.menuRepository.delete(id);
      this.logger.log(`Menu with id ${id} has been deleted`);
    } catch (error) {
      this.logger.error(`Error deleting menu: ${error.message}`);
      throw new Error(`Failed to delete menu: ${error.message}`);
    }
  }

  /**
   * Busca todos los menús de un tipo específico
   * @param menuTypeId - ID del tipo de menú
   * @returns Promise<Menu[]> - Lista de menús del tipo especificado
   */
  async findByMenuType(menuTypeId: number): Promise<Menu[]> {
    try {
      this.logger.log(`Fetching menus by menuTypeId: ${menuTypeId}`);
      return await this.menuRepository.find({
        where: { menuTypeId },
        relations: ['menuType'],
      });
    } catch (error) {
      this.logger.error(`Error finding menus by menuType: ${error.message}`);
      throw new Error(`Failed to find menus by menuType: ${error.message}`);
    }
  }

  /**
   * Busca un menú específico incluyendo sus productos asociados
   * @param id - ID del menú a buscar
   * @returns Promise<Menu> - El menú con sus productos relacionados
   */
  async findWithProducts(): Promise<Menu[]> {
    try {
      const menus = await this.menuRepository.find({
        relations: ['menuProducts', 'menuProducts.product', 'menuType'],
      });

      if (!menus.length) {
        throw new NotFoundException('No menus found');
      }

      return menus;
    } catch (error) {
      this.logger.error(`Error finding menus with products: ${error}`);
      throw new InternalServerErrorException(
        `Failed to find menus with products`,
      );
    }
  }

  /**
   * Obtiene todos los menús incluyendo sus productos asociados
   * @returns Promise<Menu[]> - Lista de todos los menús con sus productos
   */
  async findAllWithProducts(): Promise<Menu[]> {
    try {
      this.logger.log('Fetching all menus with products');
      return await this.menuRepository.find({
        relations: ['menuProducts', 'menuProducts.product', 'menuType'],
      });
    } catch (error) {
      this.logger.error(`Error finding all menus with products: ${error}`);
      throw new Error(`Failed to find all menus with products: ${error}`);
    }
  }

  /**
   * Obtiene solo los menús que tienen stock disponible (cantidad > 0)
   * @returns Promise<Menu[]> - Lista de menús disponibles para consumo
   */
  async findAvailableMenus(): Promise<Menu[]> {
    try {
      this.logger.log('Fetching available menus (quantity > 0)');
      return await this.menuRepository.find({
        where: { quantity: MoreThan(0) },
        relations: ['menuType'],
      });
    } catch (error) {
      this.logger.error(`Error finding available menus: ${error.message}`);
      throw new Error(`Failed to find available menus: ${error.message}`);
    }
  }

  async changeMenuStatus(menuId: number): Promise<Menu> {
    try {
      const menu = await this.menuRepository.findOne({ where: { id: menuId } });
      if (!menu) throw new NotFoundException('Menu not found');

      menu.active = !menu.active;
      return this.menuRepository.save(menu);
    } catch (error) {
      this.logger.error(`Error changing menu status: ${error.message}`);
      throw new ConflictException(
        `Failed to change menu status: ${error.message}`,
      );
    }
  }
}
