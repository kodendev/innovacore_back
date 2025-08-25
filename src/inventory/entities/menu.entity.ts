import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
  ManyToOne,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';
import { MenuProduct } from './menu_product.entity';
import { MenuType } from './menu_types.entity';

// Menu               Product
//  └── quantity 🟩       └── nombre, etc.
//   │
//   └────┐
//        │
//        ▼
//    MenuProduct 🟥 (sirve para saber la cantidad de cada producto en el menú)

@Entity()
export class Menu {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  quantity: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @OneToMany(() => MenuProduct, (mp) => mp.menu)
  menuProducts: MenuProduct[];

  @ManyToOne(() => MenuType, (menuType) => menuType.menus)
  @JoinColumn({ name: 'menuTypeId' })
  menuType: MenuType;

  @Column()
  menuTypeId: number;

  @Column({ default: true }) // 👈 nuevo campo booleano
  active: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
