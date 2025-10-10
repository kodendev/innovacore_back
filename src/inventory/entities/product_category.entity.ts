import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { Product } from './products.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  // Relación con productos
  @OneToMany(() => Product, (product) => product.category)
  products: Product[];

  // Relación recursiva: una categoría puede tener un "padre"
  @ManyToOne(() => Category, (category) => category.children, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  parent?: Category;

  // Relación inversa: una categoría puede tener muchos "hijos"
  @OneToMany(() => Category, (category) => category.parent)
  children?: Category[];
}
