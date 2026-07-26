import type { Action } from '@/classes/Action';
import type Tag from '@/classes/Tag';
import type { Deployable } from '@/classes/components/feature/deployable/Deployable';
import type { MechEquipment } from '@/classes/mech/components/equipment/MechEquipment';

interface IInfoCardItem {
  Name: string;
  Icon: string;
  Note?: string;
  Description?: string;
  Effect?: string;
  LicenseString?: string;
  Tags?: Tag[];
  Actions?: Action[];
  Deployables?: Deployable[];
  IntegratedEquipment?: MechEquipment[];
}

export type { IInfoCardItem };
