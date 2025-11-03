import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { PatientStatus } from './patient-status.entity';
import { Bed } from 'src/beds/entities/bed.entity';

@Entity('patients')
export class Patient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  documentNumber: string;

  @Column({ nullable: true })
  age: number;

  @Column({ nullable: true })
  diagnosis: string;

  @Column({ default: true })
  active: boolean;

  // Relación con cama (una cama puede tener varios pacientes a lo largo del tiempo)
  @ManyToOne(() => Bed, (bed) => bed.patients, { nullable: true })
  @JoinColumn({ name: 'bed_id' })
  bed: Bed | null;

  // Historial de estados del paciente
  @OneToMany(() => PatientStatus, (status) => status.patient, { cascade: true })
  statuses: PatientStatus[];

  @Column({ name: 'bed_id', nullable: true })
  bedId?: number;

  @Column({ name: 'needsReview', nullable: true, default: false })
  needsReview?: boolean;
}
