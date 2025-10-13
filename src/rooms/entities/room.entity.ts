import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Bed } from 'src/beds/entities/bed.entity'; // la referenciamos aunque aún no exista

@Entity({ name: 'rooms' })
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string; // Ej: "Habitación 301"

  @Column({ nullable: true })
  floor: number;

  @Column({ default: 'active' })
  status: 'active' | 'inactive';

  // Relaciones
  @OneToMany(() => Bed, (bed) => bed.room)
  beds: Bed[];
}
