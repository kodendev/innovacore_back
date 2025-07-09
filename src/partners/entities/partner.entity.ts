import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { PartnerType } from "./partner_type.entity";

@Entity()
export class Partner {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    phone: string;

    @Column()
    address: string;

    @Column()
    city: string;

    @Column()
    state: string;

    @Column()
    zip: string;

    @Column()
    country: string;

    // Relación con PartnerType
    @ManyToOne(() => PartnerType, (partnerType) => partnerType.partners) // este es el objeto que se va a relacionar, nos permite acceder a los partners de un partnerType
    @JoinColumn({ name: 'partnerTypeId' }) // clave foránea
    partnerType: PartnerType;

    @Column() // la columna que se va a crear en la base de datos
    partnerTypeId: number; // la FK real en la base

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
