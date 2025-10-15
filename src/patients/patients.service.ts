import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from './entities/patient.entity';
import { PatientStatus } from './entities/patient-status.entity';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { AssignBedDto } from './dto/assign-bed.dto';
import { AddStatusDto } from './dto/add-status.dto';
import { Bed } from 'src/beds/entities/bed.entity';
import { User } from 'src/partners/entities/user.entity';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepo: Repository<Patient>,

    @InjectRepository(PatientStatus)
    private readonly statusRepo: Repository<PatientStatus>,

    @InjectRepository(Bed)
    private readonly bedRepo: Repository<Bed>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(createPatientDto: CreatePatientDto) {
    const { bedId, ...data } = createPatientDto;

    let bed: Bed | null = null;
    if (bedId !== undefined && bedId !== null) {
      bed = await this.bedRepo.findOne({ where: { id: bedId } });
      if (!bed) {
        throw new NotFoundException(`Bed ${bedId} not found`);
      }
    }

    const patient = this.patientRepo.create({
      ...data,
      bed, // relación
    });

    return this.patientRepo.save(patient);
  }

  async findAll() {
    return this.patientRepo.find({
      relations: ['bed', 'statuses', 'statuses.updatedBy'],
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number) {
    const patient = await this.patientRepo.findOne({
      where: { id },
      relations: ['bed', 'statuses', 'statuses.updatedBy'],
    });
    if (!patient) throw new NotFoundException('Paciente no encontrado');
    return patient;
  }

  async update(id: number, updateDto: UpdatePatientDto) {
    const {
      bedId,
      ...data
    }: { bedId?: number | null } & Partial<CreatePatientDto> = updateDto;

    const patient = await this.patientRepo.findOne({
      where: { id },
      relations: ['bed', 'statuses'],
    });
    if (!patient) throw new NotFoundException('Paciente no encontrado');

    // Actualizar campos simples
    Object.assign(patient, data);

    // Manejar cambio de cama si viene en el DTO
    if (typeof bedId !== 'undefined') {
      if (bedId === null) {
        // desasignar cama
        patient.bed = null;
      } else {
        const bed = await this.bedRepo.findOne({ where: { id: bedId } });
        if (!bed) throw new NotFoundException(`Bed ${bedId} not found`);
        patient.bed = bed;
      }
    }

    return this.patientRepo.save(patient);
  }

  async remove(id: number) {
    await this.patientRepo.delete(id);
    return { deleted: true };
  }

  async assignBed(id: number, dto: AssignBedDto) {
    const patient = await this.findOne(id);
    const bed = await this.bedRepo.findOne({ where: { id: dto.bedId } });
    if (!bed) throw new NotFoundException('Cama no encontrada');

    patient.bed = bed;
    return this.patientRepo.save(patient);
  }

  async addStatus(id: number, dto: AddStatusDto) {
    const patient = await this.findOne(id);
    const status = this.statusRepo.create({
      statusType: dto.statusType,
      notes: dto.notes,
      patient,
    });

    if (dto.userId) {
      const user = await this.userRepo.findOne({ where: { id: dto.userId } });
      if (user) status.updatedBy = user;
    }

    await this.statusRepo.save(status);
    return this.findOne(id);
  }
}
