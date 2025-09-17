import { InjectRepository } from '@nestjs/typeorm';
import { MenuType } from '../entities/menu_types.entity';
import { Repository } from 'typeorm';
import { CreateMenuTypesDto } from '../dto/create-menu-types.dto';
import { Logger } from '@nestjs/common';
export class MenuTypeService {
  private readonly logger = new Logger(MenuTypeService.name);
  constructor(
    @InjectRepository(MenuType)
    private readonly menuTypeRepository: Repository<MenuType>,
  ) {}
  async create(createMenuTypeDto: CreateMenuTypesDto) {
    const menuType = this.menuTypeRepository.create(createMenuTypeDto);
    this.logger.log(`Creating Menu Type`);
    return await this.menuTypeRepository.save(menuType);
  }
  async findAll() {
    this.logger.log('Fetching All MenuTypes');
    return await this.menuTypeRepository.find();
  }

  async findOne(id: number) {
    this.logger.log(`Fetching Menu Type with ID ${id}`);
    return await this.menuTypeRepository.findOne({ where: { id } });
  }
}
