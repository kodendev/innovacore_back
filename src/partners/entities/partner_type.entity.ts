import { Column, Entity, PrimaryGeneratedColumn, OneToMany, UpdateDateColumn, CreateDateColumn } from "typeorm";
import { Partner } from "./partner.entity";

@Entity()
export class PartnerType {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(() => Partner, partner => partner.partnerType) // Relación con Partner (muchos a uno), al momento de crear una consulta se va a traer todos los partners que tengan el mismo partnerType
    partners: Partner[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}