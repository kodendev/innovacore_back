import { PartialType } from '@nestjs/swagger';
import { CreateBedMenuDto } from './create-bed-menu.dto';

export class UpdateBedMenuDto extends PartialType(CreateBedMenuDto) {}
