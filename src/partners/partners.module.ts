import { Module } from '@nestjs/common';
import { PartnersService } from './partners.service';
import { PartnersController } from './partners.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Partner } from './entities/partner.entity';
import { PartnerType } from './entities/partner_type.entity';
import { User } from './entities/user.entity';
import { UserType } from './entities/userType.entity';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { UserTypeController } from './controllers/usertype.controller';
import { UserTypeService } from './services/userType.service';
@Module({
  imports: [TypeOrmModule.forFeature([Partner, PartnerType, User, UserType])],
  controllers: [PartnersController, UserController, UserTypeController],
  providers: [PartnersService, UserService, UserTypeService],
  exports: [UserService],
})
export class PartnersModule {}
