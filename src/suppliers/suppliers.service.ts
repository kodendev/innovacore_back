// suppliers.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { Supplier } from './entities/supplier.entity';
import { SupplierProduct } from './entities/supplier-product.entity';
import { Product } from 'src/inventory/entities/products.entity';

@Injectable()
export class SuppliersService {
  constructor(
    @InjectRepository(Supplier)
    private readonly supplierRepo: Repository<Supplier>,

    @InjectRepository(SupplierProduct)
    private readonly supplierProductRepo: Repository<SupplierProduct>,

    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async create(createSupplierDto: CreateSupplierDto): Promise<Supplier> {
    const { products, ...supplierData } = createSupplierDto;

    const supplier = this.supplierRepo.create(supplierData);
    const savedSupplier = await this.supplierRepo.save(supplier);

    if (products && products.length > 0) {
      const supplierProducts: SupplierProduct[] = [];
      for (const p of products) {
        const product = await this.productRepo.findOne({
          where: { id: p.productId },
        });
        if (!product)
          throw new NotFoundException(`Product ${p.productId} not found`);

        supplierProducts.push(
          this.supplierProductRepo.create({
            supplier: savedSupplier,
            product,
            costPrice: p.costPrice,
          }),
        );
      }
      await this.supplierProductRepo.save(supplierProducts);
    }

    const fullSupplier = await this.supplierRepo.findOne({
      where: { id: savedSupplier.id },
      relations: ['supplierProducts', 'supplierProducts.product'],
    });

    if (!fullSupplier)
      throw new NotFoundException(`Supplier not found after creation`);

    return fullSupplier;
  }

  async findAll(): Promise<Supplier[]> {
    return this.supplierRepo.find({
      where: { active: true },
      relations: ['supplierProducts', 'supplierProducts.product'],
    });
  }

  async findOne(id: number): Promise<Supplier> {
    const supplier = await this.supplierRepo.findOne({
      where: { id },
      relations: ['supplierProducts', 'supplierProducts.product'], // 👈
    });
    if (!supplier) {
      throw new NotFoundException(`Supplier #${id} not found`);
    }
    return supplier;
  }

  async update(
    id: number,
    updateSupplierDto: UpdateSupplierDto,
  ): Promise<Supplier> {
    await this.supplierRepo.update(id, updateSupplierDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.supplierRepo.update(id, { active: false });
  }
}
