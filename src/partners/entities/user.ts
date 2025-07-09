import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserType } from "./userType.entity";
@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    password_hash: string;

    @Column()
    email: string;

    @Column()
    user_type_id: number;

    @ManyToOne(() => UserType, (userType) => userType.users)
    @JoinColumn({ name: 'user_type_id' })
    userType: UserType;

    @Column()
    active: boolean
}
