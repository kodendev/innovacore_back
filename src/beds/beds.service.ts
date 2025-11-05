import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Not, Repository } from 'typeorm';
import { Bed } from './entities/bed.entity';
import { CreateBedDto } from './dto/create-bed.dto';
import { UpdateBedDto } from './dto/update-bed.dto';

@Injectable()
export class BedsService {
  constructor(
    @InjectRepository(Bed)
    private readonly bedRepository: Repository<Bed>,
  ) {}

  // create(createBedDto: CreateBedDto) {
  //   const bed = this.bedRepository.create(createBedDto);
  //   return this.bedRepository.save(bed);
  // }

  async create(createBedDto: CreateBedDto) {
    // Validar que no exista otra cama con el mismo nombre en la misma habitación
    await this.validateUniqueBedNameInRoom(
      createBedDto.name,
      createBedDto.roomId,
    );

    const bed = this.bedRepository.create(createBedDto);
    return this.bedRepository.save(bed);
  }

  findAll() {
    return this.bedRepository.find({ relations: ['room'] });
  }

  findOne(id: number) {
    return this.bedRepository.findOne({ where: { id }, relations: ['room'] });
  }

  async update(id: number, updateBedDto: UpdateBedDto) {
    await this.bedRepository.update(id, updateBedDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.bedRepository.delete(id);
    return { deleted: true };
  }

  private async validateUniqueBedNameInRoom(
    name: string,
    roomId: number,
    excludeBedId?: number,
  ) {
    const whereCondition: FindOptionsWhere<Bed> = {
      name,
      room: { id: roomId },
    };

    // Si es una actualización, excluir la cama actual
    if (excludeBedId) {
      whereCondition.id = Not(excludeBedId);
    }

    const existingBed = await this.bedRepository.findOne({
      where: whereCondition,
      relations: ['room'],
    });

    if (existingBed) {
      throw new ConflictException(
        `Ya existe una cama con el nombre "${name}" en esta habitación`,
      );
    }
  }
}
