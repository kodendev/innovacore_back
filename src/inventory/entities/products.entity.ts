import { Column, Entity, PrimaryGeneratedColumn, OneToMany, ManyToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Inventory } from "./inventory.entity";
import { Menu } from "./menu.entity";
import { MenuProduct } from "./menu_product.entity";
@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    sale_price: number;

    @Column()
    cost_price: number;

    @Column()
    barcode: string;

    @Column()
    active: boolean;

    @OneToMany(() => Inventory, (inventory) => inventory.product)
    inventories: Inventory[];


    @OneToMany(() => MenuProduct, (mp) => mp.product)
    menuProducts: MenuProduct[];

    @Column()
    stock: number // Esto nos va a servir para ver el stock rapido , para auditarlo usaremos la tabla de
    // movimientos , dado que en el stock puede llegar a haber alguna inconsistencia (no deberia)
    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;


}