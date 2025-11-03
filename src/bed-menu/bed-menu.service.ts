import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { CreateBedMenuDto } from './dto/create-bed-menu.dto';
import { BedMenu } from './entities/bed-menu.entity';
import { Bed } from 'src/beds/entities/bed.entity';
import { Menu } from 'src/inventory/entities/menu.entity';
import { ConsumeBedMenuDto } from './dto/consume-bed-menu.dto';
import { ProductService } from '../inventory/services/products.service';

type ConsumptionResult = unknown;

export interface ConsumeResponse {
  success: boolean;
  message: string;
  bedMenuId: number;
  bedId?: number | null;
  consumedAt: string;
  consumptionRecord?: ConsumptionResult;
}

@Injectable()
export class BedMenuService {
  constructor(
    @InjectRepository(BedMenu)
    private readonly bedMenuRepo: Repository<BedMenu>,

    @InjectRepository(Bed)
    private readonly bedRepo: Repository<Bed>,

    @InjectRepository(Menu)
    private readonly menuRepo: Repository<Menu>,

    private readonly productService: ProductService,
    private readonly dataSource: DataSource,
  ) {}

  async assignMenu(dto: CreateBedMenuDto): Promise<BedMenu> {
    const bed = await this.bedRepo.findOne({ where: { id: dto.bedId } });
    if (!bed) throw new NotFoundException('Bed not found');

    const menu = await this.menuRepo.findOne({ where: { id: dto.menuId } });
    if (!menu) throw new NotFoundException('Menu not found');

    const bedMenu = this.bedMenuRepo.create({
      bedId: dto.bedId,
      menuId: dto.menuId,
      quantity: dto.quantity || 1,
    });

    return this.bedMenuRepo.save(bedMenu);
  }

  async findAll(): Promise<BedMenu[]> {
    return this.bedMenuRepo.find({ relations: ['bed', 'menu'] });
  }

  async markConsumed(id: number): Promise<BedMenu> {
    const bedMenu = await this.bedMenuRepo.findOne({ where: { id } });
    if (!bedMenu) throw new NotFoundException('Assignment not found');

    bedMenu.consumed = true;
    return this.bedMenuRepo.save(bedMenu);
  }

  async consumeBedMenu(dto: ConsumeBedMenuDto): Promise<ConsumeResponse> {
    const { bedMenuId, quantity, userId, bedId } = dto;

    // 1. Buscar el BedMenu y su menú asociado con los productos y la cama (relación 'bed')
    const bedMenu = await this.bedMenuRepo.findOne({
      where: { id: bedMenuId },
      relations: [
        'menu',
        'menu.menuProducts',
        'menu.menuProducts.product',
        'bed',
      ],
    });

    if (!bedMenu) {
      throw new NotFoundException('BedMenu no encontrado');
    }

    // 2. Si se envió bedId, validar que la asociación pertenezca a esa cama
    if (
      typeof bedId !== 'undefined' &&
      bedMenu.bed &&
      Number(bedMenu.bed.id) !== Number(bedId)
    ) {
      throw new BadRequestException(
        'El bedMenu indicado no pertenece a la cama especificada',
      );
    }

    // 3. Si ya está consumido, devolver 409 (o un 200 con info, según tu preferencia)
    if ((bedMenu as { consumed?: boolean }).consumed) {
      throw new ConflictException(
        'El menú ya fue marcado como servido para esta cama',
      );
    }

    // 4. Preparar productos a consumir (multiplicando por quantity)
    const productsToConsume = bedMenu.menu.menuProducts.map((mp) => ({
      productId: mp.productId,
      quantity: mp.quantity * quantity,
    }));

    // 5. Ejecutar consumo en transacción para mayor seguridad
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Nota: idealmente productService.addBedConsumptionMovement debería aceptar un EntityManager
      // para formar parte de la misma transacción. Si no lo hace, la llamada se hace fuera de la
      // transacción de la BD actual y podría no ser totalmente atómica. Recomendación abajo.
      const consumptionResult: ConsumptionResult =
        await this.productService.addBedConsumptionMovement({
          userId,
          products: productsToConsume,
        });

      // 6. Marcar la asociación como consumida
      bedMenu.consumed = true;
      // si tu entidad tiene consumedAt, asignarlo
      if ('consumedAt' in bedMenu) {
        bedMenu.consumedAt = new Date();
      }

      let consumedAtIso: string;
      if (bedMenu.assignedAt instanceof Date) {
        consumedAtIso = bedMenu.assignedAt.toISOString();
      } else if (typeof bedMenu.assignedAt === 'string' && bedMenu.assignedAt) {
        // por si la propiedad viene como ISO string desde el repo
        consumedAtIso = new Date(bedMenu.assignedAt).toISOString();
      } else {
        consumedAtIso = new Date().toISOString();
      }
      // Guardar usando el queryRunner.manager para quedarlo dentro de la transacción
      await queryRunner.manager.save(bedMenu);

      await queryRunner.commitTransaction();

      return {
        success: true,
        message: 'Stock consumido correctamente',
        bedMenuId: bedMenuId,
        bedId: bedMenu.bed ? bedMenu.bed.id : null,
        consumedAt: consumedAtIso,
        consumptionRecord: consumptionResult ?? null,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      // loguear si hace falta
      console.log(error);
      throw new InternalServerErrorException('Error al consumir el menú');
    } finally {
      await queryRunner.release();
    }
  }
}
