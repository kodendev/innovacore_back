import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Patient } from './patient.entity';
import { User } from 'src/partners/entities/user.entity'; // suponiendo que los usuarios internos están aquí

@Entity('patient_statuses')
export class PatientStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  statusType: string;

  @Column({ nullable: true })
  notes: string;

  @Column({ nullable: true })
  dietType?: 'liquida' | 'solida' | 'blanda' | 'enteral';

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Patient, (patient) => patient.statuses, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'updated_by' })
  updatedBy: User;
}
