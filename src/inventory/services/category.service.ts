import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Category } from '../entities/product_category.entity';
import { CreateCategoryDto } from '../dto/create-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(dto: CreateCategoryDto): Promise<Category> {
    const category = this.categoryRepository.create({ name: dto.name });

    if (dto.parentId) {
      const parent = await this.categoryRepository.findOne({
        where: { id: dto.parentId },
      });
      if (!parent) {
        throw new NotFoundException('Categoría padre no encontrada');
      }
      category.parent = parent;
    }

    return this.categoryRepository.save(category);
  }

  async findAll(): Promise<Category[]> {
    return this.categoryRepository.find({
      where: { parent: IsNull() },
      relations: ['children', 'children.children'],
    });
  }
}
