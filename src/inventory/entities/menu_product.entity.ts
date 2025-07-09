import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, ManyToMany, JoinTable, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Product } from "./products.entity";
import { Menu } from "./menu.entity";
@Entity()
export class MenuProduct {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    quantity: number; // cuántas unidades de este producto en este menú

    @ManyToOne(() => Menu, (menu) => menu.menuProducts)
    @JoinColumn({ name: "menuId" })
    menu: Menu;

    @Column()
    menuId: number;

    @ManyToOne(() => Product, (product) => product.menuProducts)
    @JoinColumn({ name: "productId" })
    product: Product;

    @Column()
    productId: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
