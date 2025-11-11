import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { AssignBedDto } from './dto/assign-bed.dto';
import { AddPatientStatusDto } from './dto/add-status.dto';
import { PatientFilterDto } from './dto/patient-filters.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Patient } from './entities/patient.entity';

@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post()
  create(@Body() dto: CreatePatientDto) {
    return this.patientsService.create(dto);
  }

  @Get()
  findAll() {
    return this.patientsService.findAll();
  }

  @Get('filters')
  @ApiOperation({
    summary: 'Obtener pacientes con filtros avanzados',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de pacientes filtrados',
    type: [Patient],
    isArray: true,
  })
  async findWithFilters(@Query() filters: PatientFilterDto) {
    return this.patientsService.findWithFilters(filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.patientsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePatientDto) {
    return this.patientsService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.patientsService.remove(+id);
  }

  @Patch(':id/assign-bed')
  assignBed(@Param('id') id: string, @Body() dto: AssignBedDto) {
    return this.patientsService.assignBed(+id, dto);
  }

  @Post(':id/add-status')
  addStatus(@Param('id') id: string, @Body() dto: AddPatientStatusDto) {
    return this.patientsService.addStatus(+id, dto);
  }
}
