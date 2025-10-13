import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './entities/room.entity';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
  ) {}

  create(createRoomDto: CreateRoomDto) {
    const room = this.roomRepository.create(createRoomDto);
    return this.roomRepository.save(room);
  }

  findAll() {
    return this.roomRepository.find({ relations: ['beds'] });
  }

  findOne(id: number) {
    return this.roomRepository.findOne({ where: { id }, relations: ['beds'] });
  }

  async update(id: number, updateRoomDto: UpdateRoomDto) {
    await this.roomRepository.update(id, updateRoomDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.roomRepository.delete(id);
    return { deleted: true };
  }
}
