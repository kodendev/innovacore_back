// suppliers.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { Supplier } from './entities/supplier.entity';

@Injectable()
export class SuppliersService {
  constructor(
    @InjectRepository(Supplier)
    private readonly supplierRepo: Repository<Supplier>,
  ) {}

  async create(createSupplierDto: CreateSupplierDto): Promise<Supplier> {
    const supplier = this.supplierRepo.create(createSupplierDto);
    return this.supplierRepo.save(supplier);
  }

  findAll(): Promise<Supplier[]> {
    return this.supplierRepo.find();
  }

  async findOne(id: number): Promise<Supplier> {
    const supplier = await this.supplierRepo.findOne({ where: { id } });
    if (!supplier) throw new NotFoundException('Supplier not found');
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
