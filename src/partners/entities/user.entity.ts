import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserType } from "./userType.entity";
import { Partner } from "./partner.entity";
@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    password_hash: string;

    @OneToOne(() => Partner)
    @JoinColumn({ name: 'partnerId' })
    partner: Partner;

    @Column()
    userTypeId: number;

    @ManyToOne(() => UserType, (userType) => userType.users)
    @JoinColumn({ name: 'userTypeId' })
    userType: UserType;

    @Column()
    active: boolean

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
