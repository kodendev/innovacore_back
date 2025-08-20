import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserType } from './userType.entity';
import { Partner } from './partner.entity';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password_hash: string;

  @OneToOne(() => Partner, { nullable: true })
  @JoinColumn({ name: 'partnerId' })
  partner: Partner;

  @Column({ nullable: false })
  userTypeId: number;

  @ManyToOne(() => UserType, (userType) => userType.users)
  @JoinColumn({ name: 'userTypeId' })
  userType: UserType;

  @Column({ nullable: false })
  active: boolean;

  @Column({ nullable: false, unique: true })
  email: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
