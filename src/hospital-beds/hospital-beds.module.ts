import { Module } from '@nestjs/common';
import { HospitalBedsService } from './hospital-beds.service';
import { HospitalBedsController } from './hospital-beds.controller';

@Module({
  controllers: [HospitalBedsController],
  providers: [HospitalBedsService],
})
export class HospitalBedsModule {}
