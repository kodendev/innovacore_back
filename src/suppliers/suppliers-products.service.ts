import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Supplier } from './entities/supplier.entity';
import { SupplierProduct } from './entities/supplier-product.entity';
import { CreateSupplierProductDto } from './dto/create-supplier-product.dto';
import { UpdateSupplierProductDto } from './dto/update-supplier-product.dto';
import { Product } from 'src/inventory/entities/products.entity';

@Injectable()
export class SupplierProductsService {
  constructor(
    @InjectRepository(SupplierProduct)
    private readonly supplierProductRepo: Repository<SupplierProduct>,

    @InjectRepository(Supplier)
    private readonly supplierRepo: Repository<Supplier>,

    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  /**
   * Asocia un producto a un proveedor con un precio de costo
   */
  async addProductToSupplier(
    supplierId: number,
    dto: CreateSupplierProductDto,
  ): Promise<SupplierProduct> {
    const supplier = await this.supplierRepo.findOne({
      where: { id: supplierId },
    });
    if (!supplier)
      throw new NotFoundException(`Supplier ${supplierId} not found`);

    const product = await this.productRepo.findOne({
      where: { id: dto.productId },
    });
    if (!product)
      throw new NotFoundException(`Product ${dto.productId} not found`);

    // Verificar si ya existe la relación
    const existing = await this.supplierProductRepo.findOne({
      where: { supplier: { id: supplierId }, product: { id: dto.productId } },
      relations: ['supplier', 'product'],
    });

    if (existing) {
      if (existing.active) {
        throw new BadRequestException(
          `Supplier ${supplierId} already offers Product ${dto.productId}`,
        );
      }
      // Reactivar y actualizar precio
      existing.costPrice = dto.costPrice;
      existing.active = true;
      return this.supplierProductRepo.save(existing);
    }

    const supplierProduct = this.supplierProductRepo.create({
      supplier,
      product,
      costPrice: dto.costPrice,
    });
    return this.supplierProductRepo.save(supplierProduct);
  }

  /**
   * Lista todos los productos ofrecidos por un proveedor
   */
  async listBySupplier(supplierId: number): Promise<SupplierProduct[]> {
    return this.supplierProductRepo.find({
      where: { supplier: { id: supplierId }, active: true },
      relations: ['product'],
    });
  }

  /**
   * Lista todos los proveedores que ofrecen un producto
   */
  async listSuppliersByProduct(productId: number): Promise<SupplierProduct[]> {
    return this.supplierProductRepo.find({
      where: { product: { id: productId }, active: true },
      relations: ['supplier'],
    });
  }

  /**
   * Actualiza el precio de costo de un producto ofrecido por un proveedor
   */
  async updatePrice(
    supplierId: number,
    productId: number,
    dto: UpdateSupplierProductDto,
  ): Promise<SupplierProduct> {
    const sp = await this.supplierProductRepo.findOne({
      where: { supplier: { id: supplierId }, product: { id: productId } },
      relations: ['supplier', 'product'],
    });

    if (!sp) throw new NotFoundException(`Relation not found`);

    if (dto.costPrice) {
      sp.costPrice = dto.costPrice;
    }

    return this.supplierProductRepo.save(sp);
  }

  /**
   * Elimina (desactiva) un producto de un proveedor
   */
  async removeProduct(supplierId: number, productId: number): Promise<void> {
    const sp = await this.supplierProductRepo.findOne({
      where: { supplier: { id: supplierId }, product: { id: productId } },
    });

    if (!sp) throw new NotFoundException(`Relation not found`);

    sp.active = false;
    await this.supplierProductRepo.save(sp);
  }
}
