import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './entities/room.entity';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { RoomFilterDto } from './dto/room-filter.dto';
import { MappedRoom, RoomOverview } from './types/roomResponseType';
import { BedMenu } from 'src/bed-menu/entities/bed-menu.entity';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
  ) {}

  create(createRoomDto: CreateRoomDto) {
    const room = this.roomRepository.create(createRoomDto);
    return this.roomRepository.save(room);
  }

  async getRoomsOverview(): Promise<RoomOverview[]> {
    // Traemos todo con relaciones
    const rooms = await this.roomRepository.find({
      relations: {
        beds: {
          bedMenus: {
            menu: true,
          },
          patients: {
            statuses: true,
          },
        },
      },
      order: {
        id: 'ASC',
        beds: {
          id: 'ASC',
          patients: {
            statuses: {
              createdAt: 'ASC', // historial ordenado cronológicamente
            },
          },
        },
      },
    });

    // Procesamos cada paciente para agregar currentStatus y eliminar el historial completo
    const roomsWithCurrentStatus = rooms.map((room) => ({
      ...room,
      beds: room.beds.map((bed) => ({
        ...bed,
        patients: bed.patients.map((patient) => {
          const sortedStatuses = patient.statuses.sort(
            (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
          );
          const currentStatus = sortedStatuses[0] || null;

          return {
            id: patient.id,
            name: patient.name,
            age: patient.age,
            diagnosis: patient.diagnosis,
            currentStatus: currentStatus
              ? {
                  statusType: currentStatus.statusType,
                  dietType: currentStatus.dietType,
                  notes: currentStatus.notes,
                }
              : null,
          };
        }),
      })),
    }));

    return roomsWithCurrentStatus;
  }

  async findAll() {
    const rooms = await this.roomRepository.find({
      relations: [
        'beds',
        'beds.bedMenus',
        'beds.bedMenus.menu',
        // traer pacientes y su historial de estados (statuses)
        'beds.patients',
        'beds.patients.statuses',
      ],
      order: { id: 'ASC', beds: { id: 'ASC' } },
    });

    // Helper: ordena y elige la bedMenu "activa"
    const pickActiveBedMenu = (bedMenus?: BedMenu[] | null) => {
      const arr = (bedMenus ?? []).slice();
      if (arr.length === 0) return null;
      // ordenar por assignedAt descendente (más reciente primero)
      arr.sort((a, b) => {
        const ta = a.assignedAt ? new Date(a.assignedAt).getTime() : 0;
        const tb = b.assignedAt ? new Date(b.assignedAt).getTime() : 0;
        return tb - ta;
      });
      // buscar primera no consumida
      const notConsumed = arr.find((bm) => !bm.consumed);
      return notConsumed ?? arr[0];
    };

    // Helper: elegir el último status del paciente por createdAt
    const pickCurrentStatus = (
      statuses?:
        | {
            createdAt?: Date;
            statusType?: string;
            dietType?: string | undefined;
            notes?: string;
          }[]
        | null,
    ) => {
      const arr = (statuses ?? []).slice();
      if (arr.length === 0) return null;
      arr.sort((a, b) => {
        const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return tb - ta;
      });
      const s = arr[0];
      return {
        statusType: s.statusType ?? '',
        dietType: s.dietType ?? null,
        notes: s.notes ?? '',
      };
    };

    // Mapear rooms a la forma que queremos exponer a la UI
    const mapped = rooms.map((room) => {
      const mappedBeds = (room.beds ?? []).map((bed) => {
        const active = pickActiveBedMenu(bed.bedMenus);

        // construir objeto currentBedMenu sólo con los campos relevantes
        const currentBedMenu = active
          ? {
              id: active.id,
              bedId: active.bedId,
              menuId: active.menuId,
              menu: active.menu,
              quantity: active.quantity,
              assignedAt: active.assignedAt,
              consumed: active.consumed,
            }
          : null;

        // Mapear pacientes incluyendo currentStatus (último status)
        const mappedPatients = (bed.patients ?? []).map((p) => {
          const currentStatus = pickCurrentStatus(p.statuses);

          return {
            id: p.id,
            name: p.name,
            age: p.age ?? null,
            diagnosis: p.diagnosis ?? null,
            needsReview: p.needsReview ?? false,
            currentStatus,
            documentNumber: p.documentNumber ?? null,
            active: p.active ?? true,
            bedId: p.bedId ?? null,
          };
        });

        return {
          id: bed.id,
          name: bed.name,
          status: bed.status,
          roomId: bed.roomId,
          currentBedMenu,
          patients: mappedPatients,
        };
      });

      return {
        id: room.id,
        name: room.name,
        floor: room.floor,
        status: room.status,
        beds: mappedBeds,
      };
    });

    return mapped;
  }

  findOne(id: number) {
    return this.roomRepository.findOne({ where: { id }, relations: ['beds'] });
  }

  async findWithFilters(filters: RoomFilterDto): Promise<MappedRoom[]> {
    const query = this.roomRepository
      .createQueryBuilder('room')
      .leftJoinAndSelect('room.beds', 'bed')
      .leftJoinAndSelect('bed.bedMenus', 'bedMenu')
      .leftJoinAndSelect('bedMenu.menu', 'menu')
      // Agregar relaciones de pacientes como en findAll
      .leftJoinAndSelect('bed.patients', 'patient')
      .leftJoinAndSelect('patient.statuses', 'patientStatus');

    // Filtros seguros (mantener como están)
    if (filters.roomStatus) {
      query.andWhere('room.status = :roomStatus', {
        roomStatus: filters.roomStatus,
      });
    }

    if (filters.floor !== undefined && !isNaN(filters.floor)) {
      query.andWhere('room.floor = :floor', { floor: filters.floor });
    }

    if (filters.bedStatus) {
      query.andWhere('bed.status = :bedStatus', {
        bedStatus: filters.bedStatus,
      });
    }

    if (filters.menuConsumed !== undefined) {
      query.andWhere('bedMenu.consumed = :menuConsumed', {
        menuConsumed: filters.menuConsumed,
      });
    }

    if (filters.menuId !== undefined && !isNaN(filters.menuId)) {
      query.andWhere('menu.id = :menuId', { menuId: filters.menuId });
    }

    if (filters.name) {
      query.andWhere('room.name ILIKE :name', { name: `%${filters.name}%` });
    }

    query
      .orderBy('room.id', 'ASC')
      .addOrderBy('bed.id', 'ASC')
      .addOrderBy('bedMenu.assignedAt', 'DESC'); // Cambiar orden para obtener más recientes primero

    const rooms = await query.getMany();

    // Aplicar la misma lógica de mapeo que findAll
    return this.mapRoomsWithActiveBedMenus(rooms);
  }

  // Extraer la lógica de mapeo a un método separado para reutilizar
  private mapRoomsWithActiveBedMenus(rooms: Room[]) {
    // Helper: ordena y elige la bedMenu "activa" (copiar de findAll)
    const pickActiveBedMenu = (bedMenus?: BedMenu[] | null) => {
      const arr = (bedMenus ?? []).slice();
      if (arr.length === 0) return null;
      arr.sort((a, b) => {
        const ta = a.assignedAt ? new Date(a.assignedAt).getTime() : 0;
        const tb = b.assignedAt ? new Date(b.assignedAt).getTime() : 0;
        return tb - ta;
      });
      const notConsumed = arr.find((bm) => !bm.consumed);
      return notConsumed ?? arr[0];
    };

    // Helper: elegir el último status del paciente (copiar de findAll)
    const pickCurrentStatus = (
      statuses?:
        | {
            createdAt?: Date;
            statusType?: string;
            dietType?: string | undefined;
            notes?: string;
          }[]
        | null,
    ) => {
      const arr = (statuses ?? []).slice();
      if (arr.length === 0) return null;
      arr.sort((a, b) => {
        const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return tb - ta;
      });
      const s = arr[0];
      return {
        statusType: s.statusType ?? '',
        dietType: s.dietType ?? null,
        notes: s.notes ?? '',
      };
    };

    // Mapear rooms (copiar lógica exacta de findAll)
    return rooms.map((room) => {
      const mappedBeds = (room.beds ?? []).map((bed) => {
        const active = pickActiveBedMenu(bed.bedMenus);

        const currentBedMenu = active
          ? {
              id: active.id,
              bedId: active.bedId,
              menuId: active.menuId,
              menu: active.menu,
              quantity: active.quantity,
              assignedAt: active.assignedAt,
              consumed: active.consumed,
            }
          : null;

        const mappedPatients = (bed.patients ?? []).map((p) => {
          const currentStatus = pickCurrentStatus(p.statuses);

          return {
            id: p.id,
            name: p.name,
            age: p.age ?? null,
            diagnosis: p.diagnosis ?? null,
            needsReview: p.needsReview ?? false,
            currentStatus,
            documentNumber: p.documentNumber ?? null,
            active: p.active ?? true,
            bedId: p.bedId ?? null,
          };
        });

        return {
          id: bed.id,
          name: bed.name,
          status: bed.status,
          roomId: bed.roomId,
          currentBedMenu,
          patients: mappedPatients,
        };
      });

      return {
        id: room.id,
        name: room.name,
        floor: room.floor,
        status: room.status,
        beds: mappedBeds,
      };
    });
  }

  async update(id: number, updateRoomDto: UpdateRoomDto) {
    await this.roomRepository.update(id, updateRoomDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.roomRepository.delete(id);
    return { deleted: true };
  }
}
