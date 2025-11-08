import { BedMenu } from 'src/bed-menu/entities/bed-menu.entity';
import { Menu } from 'src/inventory/entities/menu.entity';

export type PatientWithCurrentStatus = {
  id: number;
  name: string;
  age: number;
  diagnosis: string;
  currentStatus: {
    statusType: string;
    dietType?: 'liquida' | 'solida' | 'blanda' | 'enteral';
    notes?: string;
  } | null;
};

export type BedWithPatients = {
  id: number;
  name: string;
  status: 'available' | 'occupied' | 'maintenance' | 'disponible';
  roomId: number;
  bedMenus: BedMenu[];
  patients: PatientWithCurrentStatus[];
};

export type RoomOverview = {
  id: number;
  name: string;
  floor: number;
  status: string;
  beds: BedWithPatients[];
};

// En un archivo types/ o en el mismo service
interface MappedPatient {
  id: number;
  name: string;
  age: number | null;
  diagnosis: string | null;
  needsReview: boolean;
  currentStatus: {
    statusType: string;
    dietType: string | null;
    notes: string;
  } | null;
  documentNumber: string | null;
  active: boolean;
  bedId: number | null;
}

interface MappedBedMenu {
  id: number;
  bedId: number;
  menuId: number;
  menu: Menu; // Asegúrate de importar el tipo Menu
  quantity: number;
  assignedAt: Date | null; // ⬅️ CAMBIO: puede ser null
  consumed: boolean;
}

interface MappedBed {
  id: number;
  name: string;
  status: 'available' | 'occupied' | 'maintenance'; // ⬅️ CAMBIO: tipos específicos
  roomId: number;
  currentBedMenu: MappedBedMenu | null;
  patients: MappedPatient[];
}

export interface MappedRoom {
  id: number;
  name: string;
  floor: number;
  status: 'active' | 'inactive'; // ⬅️ CAMBIO: tipos específicos
  beds: MappedBed[];
}
