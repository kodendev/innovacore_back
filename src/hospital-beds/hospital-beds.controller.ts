import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HospitalBedsService } from './hospital-beds.service';
import { CreateHospitalBedDto } from './dto/create-hospital-bed.dto';
import { UpdateHospitalBedDto } from './dto/update-hospital-bed.dto';

@Controller('hospital-beds')
export class HospitalBedsController {
  constructor(private readonly hospitalBedsService: HospitalBedsService) {}

  @Post()
  create(@Body() createHospitalBedDto: CreateHospitalBedDto) {
    return this.hospitalBedsService.create(createHospitalBedDto);
  }

  @Get()
  findAll() {
    return this.hospitalBedsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.hospitalBedsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHospitalBedDto: UpdateHospitalBedDto) {
    return this.hospitalBedsService.update(+id, updateHospitalBedDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.hospitalBedsService.remove(+id);
  }
}
