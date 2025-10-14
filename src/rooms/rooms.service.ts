import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './entities/room.entity';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { RoomFilterDto } from './dto/room-filter.dto';

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

  async getRoomsOverview(): Promise<Room[]> {
    return this.roomRepository.find({
      relations: {
        beds: {
          bedMenus: {
            menu: true,
          },
        },
      },
      order: {
        id: 'ASC',
        beds: {
          id: 'ASC',
        },
      },
    });
  }

  findAll() {
    return this.roomRepository.find({
      relations: ['beds', 'beds.bedMenus', 'beds.bedMenus.menu'],
      order: { id: 'ASC', beds: { id: 'ASC' } },
    });
  }

  findOne(id: number) {
    return this.roomRepository.findOne({ where: { id }, relations: ['beds'] });
  }

  async findWithFilters(filters: RoomFilterDto): Promise<Room[]> {
    const query = this.roomRepository
      .createQueryBuilder('room')
      .leftJoinAndSelect('room.beds', 'bed')
      .leftJoinAndSelect('bed.bedMenus', 'bedMenu')
      .leftJoinAndSelect('bedMenu.menu', 'menu');

    // Filtros seguros
    if (filters.roomStatus) {
      query.andWhere('room.status = :roomStatus', {
        roomStatus: filters.roomStatus,
      });
    }

    if (filters.floor !== undefined && !isNaN(filters.floor)) {
      query.andWhere('room.floor = :floor', { floor: filters.floor });
    }

    if (filters.bedStatus) {
      query.andWhere('bed.status = :bedStatus', {
        bedStatus: filters.bedStatus,
      });
    }

    if (filters.menuConsumed !== undefined) {
      query.andWhere('bedMenu.consumed = :menuConsumed', {
        menuConsumed: filters.menuConsumed,
      });
    }

    if (filters.menuId !== undefined && !isNaN(filters.menuId)) {
      query.andWhere('menu.id = :menuId', { menuId: filters.menuId });
    }

    if (filters.name) {
      query.andWhere('room.name ILIKE :name', { name: `%${filters.name}%` });
    }

    query
      .orderBy('room.id', 'ASC')
      .addOrderBy('bed.id', 'ASC')
      .addOrderBy('bedMenu.id', 'ASC');

    return query.getMany();
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
