import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/products.entity';
import { CreateProductDto } from 'src/inventory/dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { MovementDto, PurchaseProductDto } from '../dto/purchase.dto';
import { InventoryReasons } from 'src/types/movementReason.enum';
import { InventoryService } from '../inventory.service';
import { CreateInventoryMovementDto } from '../dto/create-inventory.dto';
import { Category } from '../entities/product_category.entity';
@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,

    @Inject(forwardRef(() => InventoryService))
    private readonly inventoryService: InventoryService,
  ) {}

  // async create(createProductDto: CreateProductDto) {
  //   this.logger.log(`Creating product: ${JSON.stringify(createProductDto)}`);
  //   const product = this.productRepository.create(createProductDto);
  //   return await this.productRepository.save(product);
  // }

  async create(createProductDto: CreateProductDto) {
    this.logger.log(`Creating product: ${JSON.stringify(createProductDto)}`);

    const product = this.productRepository.create({
      ...createProductDto,
      category: { id: createProductDto.categoryId }, // 👈 con esto basta
    });

    return await this.productRepository.save(product);
  }

  async findAll(categoryId?: number) {
    this.logger.log(
      categoryId
        ? `Fetching products filtered by categoryId=${categoryId}`
        : 'Fetching all products',
    );

    const where = categoryId ? { category: { id: categoryId } } : {};

    return await this.productRepository.find({
      where,
      relations: ['category'],
    });
  }

  async findOne(id: number) {
    this.logger.log(`Fetching product with id: ${id}`);
    const product = await this.productRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return product;
  }

  async searchByName(name: string) {
    this.logger.log(`Searching products by name: ${name}`);
    const products = await this.productRepository
      .createQueryBuilder('product')
      .where('LOWER(product.name) LIKE LOWER(:name)', { name: `%${name}%` })
      .getMany();

    if (!products || products.length === 0) {
      throw new NotFoundException(`No se encontraron productos con ese nombre`);
    }

    return products;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['category'],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    // Si viene categoryId en el DTO, actualizamos la categoría
    if (updateProductDto.categoryId) {
      const category = await this.categoryRepository.findOneBy({
        id: updateProductDto.categoryId,
      });
      if (!category) {
        throw new NotFoundException(
          `Category with ID ${updateProductDto.categoryId} not found`,
        );
      }
      product.category = category;
    }

    // Asignamos los demás campos
    Object.assign(product, updateProductDto);

    return await this.productRepository.save(product);
  }

  async remove(id: number) {
    this.logger.log(`Removing product with id: ${id}`);
    const product = await this.productRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    await this.productRepository.remove(product);
    return { message: `Product with id ${id} deleted successfully` };
  }

  /**
   * Obtiene todos los productos cuyo stock es menor o igual al stock mínimo
   * @returns Promise<Product[]> - Lista de productos con stock bajo
   */
  async getProductsWithMinStock() {
    try {
      return await this.productRepository
        .createQueryBuilder('product')
        .where('product.stock <= product.minStock')
        .getMany();
    } catch (error) {
      this.logger.error(
        `Error fetching products with min stock: ${error.message}`,
      );
      throw new Error(
        `Failed to fetch products with min stock: ${error.message}`,
      );
    }
  }

  async addStockProduct(purchaseProductDto: PurchaseProductDto) {
    const { productId, quantity } = purchaseProductDto;
    const product = await this.findOne(productId);
    if (!product) {
      throw new NotFoundException(`Product with id ${productId} not found`);
    }
    product.stock += quantity;
    await this.productRepository.save(product);
  }

  async discountStockProduct(productId: number, quantity: number) {
    const product = await this.findOne(productId);
    if (!product) {
      throw new NotFoundException(`Product with id ${productId} not found`);
    }
    product.stock -= quantity;
    await this.productRepository.save(product);
  }

  async addPurchase(movementDto: MovementDto) {
    // Validate and process the purchase DTO
    for (const product of movementDto.products) {
      const { productId, quantity } = product;

      if (!quantity || quantity <= 0) {
        throw new BadRequestException('La cantidad debe ser mayor que 0');
      }

      await this.addStockProduct({ productId, quantity });
      const buildMovementDto: CreateInventoryMovementDto = {
        productId,
        quantity,
        reason: InventoryReasons.PURCHASE,
        userId: movementDto.userId,
      };
      const movement =
        await this.inventoryService.registerMovement(buildMovementDto);
      if (!movement) {
        throw new Error('Failed to register inventory movement');
      }
    }
  }
  async addSaleMovement(movementDto: MovementDto) {
    // Validate and process the sale DTO
    for (const product of movementDto.products) {
      const { productId, quantity } = product;
      await this.discountStockProduct(productId, quantity);
      const buildMovementDto: CreateInventoryMovementDto = {
        productId,
        quantity,
        reason: InventoryReasons.SALE,
        userId: movementDto.userId,
      };
      const movement =
        await this.inventoryService.registerMovement(buildMovementDto);
      if (!movement) {
        throw new Error('Failed to register inventory movement');
      }
    }
  }

  async addBedConsumptionMovement(movementDto: MovementDto) {
    // Validate and process the bed consumption DTO
    for (const product of movementDto.products) {
      const { productId, quantity } = product;
      await this.discountStockProduct(productId, quantity);
      const buildMovementDto: CreateInventoryMovementDto = {
        productId,
        quantity,
        reason: InventoryReasons.BED_CONSUMPTION,
        userId: movementDto.userId,
      };
      const movement =
        await this.inventoryService.registerMovement(buildMovementDto);
      if (!movement) {
        throw new Error('Failed to register inventory movement');
      }
    }
  }
}
