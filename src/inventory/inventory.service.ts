import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { CreateInventoryMovementDto } from './dto/create-inventory.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductService } from './services/products.service';
import { Inventory } from './entities/inventory.entity';
import { MovementType } from './entities/movementType.entity';
import { User } from 'src/partners/entities/user.entity';
// import { UpdateInventoryDto } from './dto/update-inventory.dto';

// PURCHASE = 'Compra proveedor',
//   SALE = 'Venta cliente',
//   INTERNAL_CONSUMPTION = 'Consumo interno',
//   ADJUSTMENT = 'Ajuste inventario',
@Injectable()
export class InventoryService {
  private readonly logger = new Logger(InventoryService.name);
  constructor(
    @InjectRepository(MovementType)
    private readonly movementTypeRepository: Repository<MovementType>,
    @InjectRepository(Inventory)
    private readonly inventoryMovementRepository: Repository<Inventory>,

    @Inject(forwardRef(() => ProductService))
    private readonly productService: ProductService,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Se agrega un nuevo movimiento de inventario para compras de productos
  async registerMovement(
    createInventoryMovementDto: CreateInventoryMovementDto,
  ) {
    try {
      // 1. Buscar producto
      const product = await this.productService.findOne(
        createInventoryMovementDto.productId,
      );

      if (!product) {
        this.logger.warn(
          `Product not found: ${createInventoryMovementDto.productId}`,
        );
        throw new Error('Product not found');
      }
      const user = await this.userRepository.findOneBy({
        id: createInventoryMovementDto.userId,
      });

      if (!user) {
        this.logger.warn(
          `User not found: ${createInventoryMovementDto.userId}`,
        );
        throw new Error('User not found');
      }

      // 4. Registrar movimiento en inventario
      const movement = this.inventoryMovementRepository.create({
        product,
        reason: createInventoryMovementDto.reason,
        quantity: createInventoryMovementDto.quantity,
        finalStock: product.stock,
        createdAt: new Date(),
        user,
      });
      await this.inventoryMovementRepository.save(movement);
      return true;
    } catch (error) {
      this.logger.error(`Error adding inventory movement: ${error.message}`);
      throw error;
    }
  }

  async findAll() {
    return this.inventoryMovementRepository.find({
      relations: ['product', 'user'], // opcional, si querés traer datos completos
      order: { createdAt: 'DESC' }, // para ver el historial más reciente primero
    });
  }

  // addSale(createInventoryMovementDto: CreateInventoryMovementDto) {
  //   const product = createInventoryMovementDto.product;
  //   const quantity = createInventoryMovementDto.quantity;
  //   const reason = InventoryReasons.SALE;
  // }

  // addInternalConsumption(
  //   createInventoryMovementDto: CreateInventoryMovementDto,
  // ) {}

  // addAdjustment(createInventoryMovementDto: CreateInventoryMovementDto) {}

  // findOne(id: number) {
  //   return `This action returns a #${id} inventory`;
  // }

  // // update(id: number, updateInventoryDto: UpdateInventoryDto) {
  // //   return `This action updates a #${id} inventory`;
  // // }

  // remove(id: number) {
  //   return `This action removes a #${id} inventory`;
  // }
}
