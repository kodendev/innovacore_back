import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CategoryService } from '../services/category.service';
import { CreateCategoryDto } from '../dto/create-category.dto';

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

  @Post()
  @ApiOperation({ summary: 'Crear una nueva categoría o subcategoría' })
  create(@Body() dto: CreateCategoryDto) {
    return this.categoryService.create(dto);
  }
}
