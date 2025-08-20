import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserType } from '../entities/userType.entity';
import { CreateUserTypeDto } from '../dto/create-userType.dto';
import { UpdateUserTypeDto } from '../dto/update-userType.dto';

@Injectable()
export class UserTypeService {
  constructor(
    @InjectRepository(UserType)
    private userTypeRepository: Repository<UserType>,
  ) {}

  async create(createUserTypeDto: CreateUserTypeDto) {
    const existing = await this.userTypeRepository.findOne({
      where: { name: createUserTypeDto.name },
    });

    if (existing) {
      throw new BadRequestException('UserType already exists');
    }

    const userType = this.userTypeRepository.create(createUserTypeDto);
    return this.userTypeRepository.save(userType);
  }

  findAll() {
    return this.userTypeRepository.find({ relations: ['users'] });
  }

  async findOne(id: number) {
    const userType = await this.userTypeRepository.findOne({
      where: { id },
      relations: ['users'],
    });
    if (!userType) {
      throw new NotFoundException('UserType not found');
    }
    return userType;
  }

  async update(id: number, updateUserTypeDto: UpdateUserTypeDto) {
    const userType = await this.findOne(id);
    Object.assign(userType, updateUserTypeDto);
    return this.userTypeRepository.save(userType);
  }

  async remove(id: number) {
    const userType = await this.findOne(id);
    return this.userTypeRepository.remove(userType);
  }
}
