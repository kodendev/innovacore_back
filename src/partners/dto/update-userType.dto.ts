import { PartialType } from '@nestjs/swagger';
import { CreateUserTypeDto } from './create-userType.dto';

export class UpdateUserTypeDto extends PartialType(CreateUserTypeDto) {}
