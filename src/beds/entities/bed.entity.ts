import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  Unique,
} from 'typeorm';
import { Room } from 'src/rooms/entities/room.entity';
import { BedMenu } from 'src/bed-menu/entities/bed-menu.entity';
import { Patient } from 'src/patients/entities/patient.entity';

@Entity({ name: 'beds' })
@Unique(['name', 'room'])
export class Bed {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: 'available' })
  status: 'available' | 'occupied' | 'maintenance';

  // Relación con Room
  @ManyToOne(() => Room, (room) => room.beds, { onDelete: 'CASCADE' })
  room: Room;

  @Column()
  roomId: number; // FK a Room

  @OneToMany(() => BedMenu, (bedMenu) => bedMenu.bed)
  bedMenus: BedMenu[];

  @OneToMany(() => Patient, (patient) => patient.bed)
  patients: Patient[];
}
