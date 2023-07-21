// global declaration file for common interfaces that are used too often to warrant placing in @/interfaces
declare interface IImageContainer {
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

declare interface IErrorReport {
  time: Date;
  message: string;
  component?: string;
  stack: string;
}

declare interface IRankedData {
  id: string;
  rank: number;
  custom?: boolean;
  custom_desc?: string;
  custom_detail?: string;
}

declare interface IEquipmentData {
  id: string;
  destroyed: boolean;
  cascading: boolean;
  note: string;
  uses?: number;
  flavorName?: string;
  flavorDescription?: string;
  customDamageType?: string;
}

declare interface IMechWeaponSaveData extends IEquipmentData {
  loaded: boolean;
  mod?: IEquipmentData;
  customDamageType?: string;
  maxUseOverride?: number;
  selectedProfile: number;
}

declare interface ICounterSaveData {
  id: string;
  val: number;
}

declare interface IOrganizationData {
  name: string;
  purpose: string;
  description: string;
  efficiency: number;
  influence: number;
  actions: string;
}

declare interface IHistoryItem {
  field: string;
  val?: any;
}

declare interface IMountData {
  mount_type: string;
  lock: boolean;
  slots: IWeaponSlotData[];
  extra: IWeaponSlotData[];
  bonus_effects: string[];
}

declare interface IWeaponSlotData {
  size: string;
  weapon: IMechWeaponSaveData | null;
}

declare interface ITagData {
  id: string;
  val?: string | number;
}

declare interface ILicenseRequirement {
  source: string;
  name: string;
  rank: number;
  items: string[];
  missing?: boolean;
}

declare interface ISnackbarSettings {
  text: string;
  multiline?: boolean;
  timeout?: number;
  color?: string;
  visible?: boolean;
}

declare interface Brew {
  info: string;
  dir: string;
}

declare interface PrintOptions {
  mech_id: string;
  loadout_index: number;
  combo: boolean;
}

declare interface Status {
  name: string;
  type: string;
  icon: string;
  effects: string[];
}

declare interface Environment {
  id: string;
  name: string;
  description: string;
}

declare interface Sitrep {
  id: string;
  name: string;
  description: string;
  pcVictory: string;
  enemyVictory: string;
  noVictory?: string;
  deployment?: string;
  objective?: string;
  controlZone?: string;
  extraction?: string;
}
