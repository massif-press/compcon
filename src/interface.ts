// Maintain this file as the single point of import for all interface definitions
// (to the extent possible) in order to avoid any circular reference errors. Basic types and
// abstract classes should be imported before their children. AFAIK the definitions can be
// stored anywhere and collected imports are fine as long as their constituents are imported
// first in this file.

import { ICompendiumItemData } from './classes/CompendiumItem';
import { ILicensedItemData } from './classes/pilot/components/license/LicensedItem';
import { ISynergyData } from './classes/components/feature/synergy/Synergy';
import { Action } from './classes/Action';
import { ICoreData } from './classes/mech/components/frame/CoreSystem';
import { IFrameData, IFrameStats } from './classes/mech/components/frame/Frame';
import { IMechEquipmentData } from './classes/mech/components/equipment/MechEquipment';
import { IDamageData } from './classes/Damage';
import { IRangeData } from './classes/Range';
import { IMechSystemData } from './classes/mech/components/equipment/MechSystem';
import { IWeaponModData } from './classes/mech/components/equipment/WeaponMod';
import { ICoreBonusData } from './classes/pilot/components/corebonus/CoreBonus';
import { IPilotEquipmentData } from './classes/pilot/components/Loadout/equipment/PilotEquipment';
import { IPilotArmorData } from './classes/pilot/components/Loadout/equipment/PilotArmor';
import { IPilotWeaponData } from './classes/pilot/components/Loadout/equipment/PilotWeapon';
import { IManufacturerData } from './classes/Manufacturer';
import { ITalentData } from './classes/pilot/components/talent/Talent';
import { ISkillData } from './classes/pilot/components/skill/Skill';
import {
  IMechWeaponData,
  IMechWeaponSaveData,
} from './classes/mech/components/equipment/MechWeapon';
import {
  IContentPackManifest,
  IContentPack,
  ContentPackDependency,
} from './classes/ContentPack';
import { ICounterData } from './classes/components/combat/counters/Counter';
import { ITagCompendiumData } from './classes/Tag';
import { PilotData } from './classes/pilot/Pilot';
import { IPilotLoadoutData } from './classes/pilot/components/Loadout/PilotLoadout';
import { IStatusData } from './classes/Status';
import { IActionData } from './classes/Action';
import { IBackgroundData } from './classes/Background';
import { ILicenseSaveData, IReserveData } from './classes/pilot/components';
import { ISitrepData } from './classes/encounter/Sitrep';

interface IImageContainer {
  SetLocalImage(): any;
  SetCloudImage(): any;
  Image: string;
}

interface INotificationVariant {
  color: string;
  icon: string;
  prefix?: string;
  timeout?: number;
}

interface INotification {
  id: string;
  variant: string;
  text: string;
  onClick?: () => void;
}

interface IErrorReport {
  time: Date;
  message: string;
  component?: string;
  stack: string;
}

interface IRankedData {
  id: string;
  rank: number;
  custom?: boolean;
  custom_desc?: string;
  custom_detail?: string;
  data?: ISkillData | ITalentData | ILicenseSaveData;
  stub?: any; // LicenseStub or similar
}

interface IEquipmentData {
  id: string;
  note: string;
  flavorName?: string;
  flavorDescription?: string;
  customDamageType?: string;
  data?: any;
}

interface IOrganizationData {
  name: string;
  purpose: string;
  description: string;
  efficiency: number;
  influence: number;
  actions: string;
}

interface IHistoryItem {
  field: string;
  val?: any;
}

interface IMountData {
  mount_type: string;
  lock: boolean;
  slots: IWeaponSlotData[];
  extra: IWeaponSlotData[];
  bonus_effects: string[] | ICoreBonusData[];
}

interface IWeaponSlotData {
  size: string;
  weapon: IMechWeaponSaveData | null;
}

interface ITagData {
  id: string;
  val?: string | number;
}

interface ISnackbarSettings {
  text: string;
  multiline?: boolean;
  timeout?: number;
  color?: string;
  visible?: boolean;
}

interface Brew {
  info: string;
  dir: string;
}

interface PrintOptions {
  mech_id: string;
  loadout_index: number;
  combo: boolean;
}

export { Action, PilotData };
export type {
  ICompendiumItemData,
  ILicensedItemData,
  ISynergyData,
  ICoreData,
  IFrameData,
  IFrameStats,
  IMechEquipmentData,
  IDamageData,
  IRangeData,
  IMechSystemData,
  IWeaponModData,
  ICoreBonusData,
  IPilotEquipmentData,
  IPilotArmorData,
  IPilotWeaponData,
  IManufacturerData,
  ITalentData,
  ISkillData,
  IMechWeaponData,
  IContentPackManifest,
  IContentPack,
  ContentPackDependency,
  ICounterData,
  ITagCompendiumData,
  IImageContainer,
  INotificationVariant,
  INotification,
  IErrorReport,
  IRankedData,
  IEquipmentData,
  IMechWeaponSaveData,
  IOrganizationData,
  IPilotLoadoutData,
  IHistoryItem,
  IMountData,
  IWeaponSlotData,
  ITagData,
  ISnackbarSettings,
  Brew,
  PrintOptions,
  IActionData,
  IBackgroundData,
  IReserveData,
  ISitrepData,
  IStatusData,
};
