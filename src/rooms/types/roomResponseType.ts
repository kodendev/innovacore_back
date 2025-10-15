import { BedMenu } from 'src/bed-menu/entities/bed-menu.entity';

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
