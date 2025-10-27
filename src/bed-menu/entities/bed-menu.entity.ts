import { Bed } from 'src/beds/entities/bed.entity';
import { Menu } from 'src/inventory/entities/menu.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class BedMenu {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Bed, (bed) => bed.bedMenus, { onDelete: 'CASCADE' })
  bed: Bed;

  @Column()
  bedId: number;

  @ManyToOne(() => Menu, (menu) => menu.bedMenus, { onDelete: 'CASCADE' })
  menu: Menu;

  @Column()
  menuId: number;

  @Column({ default: 1 })
  quantity: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  assignedAt: Date | null;

  @Column({ default: false })
  consumed: boolean;
}
