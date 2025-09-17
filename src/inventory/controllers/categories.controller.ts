import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CategoryService } from '../services/category.service';

@ApiTags('Categorias de productos')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @ApiOperation({
    summary: 'Listar todas las categorías para cada producto dentro de stock',
  })
  findAll() {
    return this.categoryService.findAll();
  }
}
