import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from './entities/patient.entity';
import { PatientStatus } from './entities/patient-status.entity';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { AssignBedDto } from './dto/assign-bed.dto';
import { Bed } from 'src/beds/entities/bed.entity';
import { User } from 'src/partners/entities/user.entity';
import { AddPatientStatusDto } from './dto/add-status.dto';
import { PatientFilterDto } from './dto/patient-filters.dto';

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
      bed,
    });

    return this.patientRepo.save(patient);
  }

  async findAll() {
    return this.patientRepo.find({
      relations: ['bed', 'statuses', 'statuses.updatedBy'],
      order: { id: 'ASC' },
    });
  }

  async findWithFilters(filters: PatientFilterDto): Promise<Patient[]> {
    const query = this.patientRepo
      .createQueryBuilder('patient')
      .leftJoinAndSelect('patient.bed', 'bed')
      .leftJoinAndSelect('patient.statuses', 'patientStatus')
      .leftJoinAndSelect('patientStatus.updatedBy', 'updatedBy');

    // Filtro por nombre (búsqueda parcial, insensible a mayúsculas)
    if (filters.name) {
      query.andWhere('patient.name ILIKE :name', {
        name: `%${filters.name}%`,
      });
    }

    // Filtro por documento
    if (filters.documentNumber) {
      query.andWhere('patient.documentNumber ILIKE :documentNumber', {
        documentNumber: `%${filters.documentNumber}%`,
      });
    }

    // Filtro por estado activo/inactivo
    if (filters.active !== undefined) {
      query.andWhere('patient.active = :active', {
        active: filters.active,
      });
    }

    // ⬅️ FILTRO SEGURO: Por statusType del estado más reciente usando EXISTS
    if (filters.statusType) {
      query.andWhere(
        `EXISTS (
        SELECT 1 FROM patient_statuses ps 
        WHERE ps.patient_id = patient.id 
        AND ps."statusType" = :statusType 
        AND ps.id = (
          SELECT MAX(ps2.id) 
          FROM patient_statuses ps2 
          WHERE ps2.patient_id = patient.id
        )
      )`,
        { statusType: filters.statusType },
      );
    }

    // ⬅️ FILTRO SEGURO: Por dietType del estado más reciente usando EXISTS
    if (filters.dietType) {
      query.andWhere(
        `EXISTS (
        SELECT 1 FROM patient_statuses ps 
        WHERE ps.patient_id = patient.id 
        AND ps."dietType" = :dietType 
        AND ps.id = (
          SELECT MAX(ps2.id) 
          FROM patient_statuses ps2 
          WHERE ps2.patient_id = patient.id
        )
      )`,
        { dietType: filters.dietType },
      );
    }

    // Ordenar por ID del paciente y por fecha del status (más reciente primero)
    query
      .orderBy('patient.id', 'ASC')
      .addOrderBy('patientStatus.createdAt', 'DESC');

    return await query.getMany();
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
    const patient = await this.patientRepo.findOne({ where: { id } });
    if (!patient) throw new NotFoundException(`Patient ${id} not found`);

    if (dto.bedId === null) {
      patient.bed = null;
    } else if (dto.bedId !== undefined) {
      const bed = await this.bedRepo.findOne({ where: { id: dto.bedId } });
      if (!bed) throw new NotFoundException(`Bed ${dto.bedId} not found`);
      patient.bed = bed;
    }

    return this.patientRepo.save(patient);
  }

  async addStatus(patientId: number, dto: AddPatientStatusDto) {
    const patient = await this.patientRepo.findOne({
      where: { id: patientId },
      relations: ['statuses'],
    });
    if (!patient) throw new NotFoundException(`Patient ${patientId} not found`);

    const user = await this.userRepo.findOne({ where: { id: dto.userId } });
    if (!user) throw new NotFoundException(`User ${dto.userId} not found`);

    const status = this.statusRepo.create({
      patient: patient,
      changedBy: user,
      statusType: dto.statusType,
      dietType: dto.dietType,
      notes: dto.description,
      timestamp: new Date(),
    } as Partial<PatientStatus>);

    const savedStatus = await this.statusRepo.save(status);

    const lastStatus =
      (patient.statuses ?? []).slice().sort((a, b) => {
        const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return tb - ta;
      })[0] ?? null;

    let needsReview = patient.needsReview ?? false;

    if (dto.statusType === 'alta') {
      // dar de alta limpia la revisión
      needsReview = false;
    } else {
      if (!lastStatus) {
        // si no había historial, consideramos que es relevante
        needsReview = true;
      } else {
        const statusChanged = lastStatus.statusType !== dto.statusType;
        const dietChanged =
          (lastStatus.dietType ?? null) !== (dto.dietType ?? null);
        if (statusChanged || dietChanged) needsReview = true;
        // si no cambió nada relevante, dejamos needsReview tal como estaba
      }
    }

    // actualizar paciente sólo si cambió la flag
    if (patient.needsReview !== needsReview) {
      patient.needsReview = needsReview;
      await this.patientRepo.save(patient);
    }

    return savedStatus;
  }
}
