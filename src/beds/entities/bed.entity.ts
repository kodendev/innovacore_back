import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Room } from 'src/rooms/entities/room.entity';

@Entity({ name: 'beds' })
export class Bed {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string; // Ej: "Cama 301A"

  @Column({ default: 'available' })
  status: 'available' | 'occupied' | 'maintenance';

  // Relación con Room
  @ManyToOne(() => Room, (room) => room.beds, { onDelete: 'CASCADE' })
  room: Room;

  @Column()
  roomId: number; // FK a Room

  // Luego podremos agregar columna pacienteId cuando tengamos entidad Patient
}
