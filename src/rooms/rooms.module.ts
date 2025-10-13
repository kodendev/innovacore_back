import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { Bed } from 'src/beds/entities/bed.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Room, Bed])],
  controllers: [RoomsController],
  providers: [RoomsService],
  exports: [RoomsService],
})
export class RoomsModule {}
