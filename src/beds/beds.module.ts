import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bed } from './entities/bed.entity';
import { BedsService } from './beds.service';
import { BedsController } from './beds.controller';
import { Room } from 'src/rooms/entities/room.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Bed, Room])],
  controllers: [BedsController],
  providers: [BedsService],
})
export class BedsModule {}
