import { PartialType } from '@nestjs/mapped-types';
import { CreateHospitalBedDto } from './create-hospital-bed.dto';

export class UpdateHospitalBedDto extends PartialType(CreateHospitalBedDto) {}
