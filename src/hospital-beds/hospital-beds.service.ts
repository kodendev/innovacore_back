import { Injectable } from '@nestjs/common';
import { CreateHospitalBedDto } from './dto/create-hospital-bed.dto';
import { UpdateHospitalBedDto } from './dto/update-hospital-bed.dto';

@Injectable()
export class HospitalBedsService {
  create(createHospitalBedDto: CreateHospitalBedDto) {
    return 'This action adds a new hospitalBed';
  }

  findAll() {
    return `This action returns all hospitalBeds`;
  }

  findOne(id: number) {
    return `This action returns a #${id} hospitalBed`;
  }

  update(id: number, updateHospitalBedDto: UpdateHospitalBedDto) {
    return `This action updates a #${id} hospitalBed`;
  }

  remove(id: number) {
    return `This action removes a #${id} hospitalBed`;
  }
}
