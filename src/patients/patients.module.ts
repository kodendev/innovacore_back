import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientsService } from './patients.service';
import { PatientsController } from './patients.controller';
import { Patient } from './entities/patient.entity';
import { Bed } from 'src/beds/entities/bed.entity';
import { PatientStatus } from './entities/patient-status.entity';
import { User } from 'src/partners/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Patient, PatientStatus, Bed, User])],
  controllers: [PatientsController],
  providers: [PatientsService],
})
export class PatientsModule {}
