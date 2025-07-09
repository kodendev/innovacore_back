import { Module } from '@nestjs/common';
import { PartnersService } from './partners.service';
import { PartnersController } from './partners.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Partner } from './entities/partner.entity';
import { PartnerType } from './entities/partner_type.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([Partner, PartnerType])
  ],
  controllers: [PartnersController],
  providers: [PartnersService],

})
export class PartnersModule { }
