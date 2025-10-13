import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bed } from './entities/bed.entity';
import { CreateBedDto } from './dto/create-bed.dto';
import { UpdateBedDto } from './dto/update-bed.dto';

@Injectable()
export class BedsService {
  constructor(
    @InjectRepository(Bed)
    private readonly bedRepository: Repository<Bed>,
  ) {}

  create(createBedDto: CreateBedDto) {
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
}
