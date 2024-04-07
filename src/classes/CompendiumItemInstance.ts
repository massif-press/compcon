import _ from 'lodash';
import { ItemType, MechEquipment, MechWeapon, MechSystem, Tag, CompendiumItem } from '../class';
import { ICompendiumItemData, ICounterData } from '../interface';
import { Action } from './Action';
import { Bonus } from './components/feature/bonus/Bonus';
import { Synergy } from './components/feature/synergy/Synergy';
import { Deployable } from './components/feature/deployable/Deployable';
import { CompendiumStore } from '@/stores';
import { IInstanceable } from './components/instance/IInstanceable';
import { IInstanceData } from './components/instance/IInstanceData';

abstract class CompendiumItemInstance {
  public Item!: IInstanceable;

  public readonly SourceData: any;
  public SourceId: string;

  constructor(data: IInstanceData) {
    this.SourceId = data.sourceId;
    this.SourceData = data.sourceData
      ? data.sourceData
      : CompendiumItemInstance.GetItemData(data.sourceType, data.sourceId);
  }

  public static GetItemData(id: string, type: string): any {
    return _.cloneDeep(CompendiumStore().ItemData(type, id));
  }

  private get _item(): CompendiumItem {
    if (!this.Item) throw new Error('Item instance unavailable');
    return this.Item as CompendiumItem;
  }

  public get Name(): string {
    return this._item.Name;
  }

  public get ItemType(): ItemType {
    return this._item.ItemType;
  }

  public get Brew(): string {
    return this._item.Brew;
  }

  public get LcpName(): string {
    return this._item.LcpName;
  }

  public get InLcp(): boolean {
    return this._item.InLcp;
  }

  public get ID(): string {
    return this._item.ID;
  }

  public get Actions(): Action[] {
    return this._item.Actions;
  }

  public get Bonuses(): Bonus[] {
    return this._item.Bonuses;
  }

  public get Synergies(): Synergy[] {
    return this._item.Synergies;
  }

  public get Deployables(): Deployable[] {
    return this._item.Deployables;
  }

  public get Counters(): ICounterData[] {
    return this._item.Counters;
  }

  public get IsHidden(): boolean {
    return this._item.IsHidden;
  }

  public get IsExotic(): boolean {
    return this._item.IsExotic;
  }

  public get FlavorName(): string {
    return this._item.FlavorName;
  }

  public get TrueName(): string {
    return this._item.TrueName;
  }

  public get Description(): string {
    return this._item.Description;
  }

  public get SpecialEquipment(): CompendiumItem[] {
    return this._item.SpecialEquipment;
  }

  public get IntegratedEquipment(): MechEquipment[] {
    return this._item.IntegratedEquipment;
  }

  public get IntegratedWeapons(): MechWeapon[] {
    return this._item.IntegratedWeapons;
  }

  public get IntegratedSystems(): MechSystem[] {
    return this._item.IntegratedSystems;
  }

  public get Tags(): Tag[] {
    return this._item.Tags;
  }

  public get Note(): string {
    return this._item.Note;
  }

  public get Icon(): string {
    return this._item.Icon;
  }

  public get Color(): string {
    return this._item.Color;
  }

  public static Serialize(item: CompendiumItemInstance): IInstanceData {
    return {
      sourceId: item.SourceId,
      sourceType: item.ItemType,
      sourceData: item.SourceData,
    };
  }
}

export { CompendiumItemInstance };
export type { ICompendiumItemData };
