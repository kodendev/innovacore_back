import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Supplier } from './supplier.entity';
import { Product } from 'src/inventory/entities/products.entity';
// Transformer para decimal -> number (TypeORM guarda DECIMAL como string)
const decimalTransformer = {
  to: (value: number) => value,
  from: (value: string) => (value === null ? null : parseFloat(value)),
};

@Entity('supplier_products')
@Unique(['supplier', 'product'])
export class SupplierProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Supplier, (s) => s.supplierProducts, { onDelete: 'CASCADE' })
  supplier: Supplier;

  @ManyToOne(() => Product, (p) => p.supplierProducts, { onDelete: 'CASCADE' })
  product: Product;

  // Precio de costo que ofrece este proveedor para este producto
  @Column('decimal', {
    precision: 10,
    scale: 2,
    transformer: decimalTransformer,
  })
  costPrice: number;

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
