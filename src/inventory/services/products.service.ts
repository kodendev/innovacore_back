import {
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
import {
  AddSaleDto,
  MovementDto,
  PurchaseProductDto,
} from '../dto/purchase.dto';
import { InventoryReasons } from 'src/types/movementReason.enum';
import { InventoryService } from '../inventory.service';
import { CreateInventoryMovementDto } from '../dto/create-inventory.dto';
@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @Inject(forwardRef(() => InventoryService))
    private readonly inventoryService: InventoryService,
  ) {}

  async create(createProductDto: CreateProductDto) {
    this.logger.log(`Creating product: ${JSON.stringify(createProductDto)}`);
    const product = this.productRepository.create(createProductDto);
    return await this.productRepository.save(product);
  }

  async findAll() {
    this.logger.log('Fetching all products');
    return await this.productRepository.find();
  }

  async findOne(id: number) {
    this.logger.log(`Fetching product with id: ${id}`);
    const product = await this.productRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    this.logger.log(
      `Updating product id ${id}: ${JSON.stringify(updateProductDto)}`,
    );
    const product = await this.productRepository.preload({
      id,
      ...updateProductDto,
    });
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
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
