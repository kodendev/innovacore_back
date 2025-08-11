import { Repository } from 'typeorm';
import { CreateMenuProductDto } from '../dto/create-menu-product.dtos';
import { MenuProduct } from '../entities/menu_product.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MenuProductService {
  // esta clase se encarga de cargar datos en la tabla intermedia de menu y porduct
  // esto nos va a servir para saber cuantos productos se usan para hacer un menu
  // por ende si vamos a hacer un menu que tiene 6 huevos en 2 menu van a ser 12
  // REFACT: vamos a comenzar creando el service sin muchas validaciones , luego las ire agregando

  constructor(
    @InjectRepository(MenuProduct)
    private readonly menuProductRepository: Repository<MenuProduct>,
  ) {}

  async create(createMenuProductDto: CreateMenuProductDto) {
    const menuProduct = this.menuProductRepository.create(createMenuProductDto);
    return await this.menuProductRepository.save(menuProduct);
  }

  async deleteByMenuId(menuId: number): Promise<void> {
    await this.menuProductRepository.delete({ menuId });
  }

  async createMany(
    menuId: number,
    products: CreateMenuProductDto[],
  ): Promise<MenuProduct[]> {
    const newMenuProducts = products.map((p) =>
      this.menuProductRepository.create({
        ...p,
        menuId,
      }),
    );
    return this.menuProductRepository.save(newMenuProducts);
  }
}
