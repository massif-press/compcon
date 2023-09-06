import { v4 as uuid } from 'uuid';
import { ImageTag } from '@/io/ImageManagement';
import { NpcClass, NpcItem } from './';
import { INpcItemSaveData } from './interfaces';
import {
  CloudController,
  GroupController,
  ICloudData,
  ICloudSyncable,
  IGroupData,
  IPortraitData,
  ISaveable,
  ISaveData,
  PortraitController,
  SaveController,
} from '../components';
import { IFeatureController } from '../components/feature/IFeatureController';
import { FeatureController } from '../components/feature/FeatureController';

import { BrewController, BrewInfo } from '../components/brew/BrewController';
import { IBrewable } from '../components/brew/IBrewable';
import { CompendiumItem } from '../CompendiumItem';
import { INpcClassSaveData, NpcClassController } from './components/npcClass/NpcClassController';
import {
  INpcFeatureSaveData,
  NpcFeatureController,
} from './components/npcFeature/NpcFeatureController';
import { NpcTemplateController } from './components/npcTemplate/NpcTemplateController';
import {
  NarrativeController,
  NarrativeElementData,
} from '../components/narrative/NarrativeController';
import { INarrativeElement } from '../components/narrative/INarrativeElement';
import { IStatData, StatController } from '../components/combat/stats/StatController';

class INpcData implements INpcClassSaveData, INpcFeatureSaveData {
  id!: string;
  save!: ISaveData;
  cloud!: ICloudData;
  brews!: BrewInfo[];
  img!: IPortraitData;
  group!: IGroupData;
  narrative!: NarrativeElementData;
  stats!: IStatData;

  name!: string;
  class!: string;
  tier!: number;
  subtitle!: string;
  tag!: string;
  note!: string;
  templates!: string[];
  items!: INpcItemSaveData[];
}

class Npc implements ICloudSyncable, ISaveable, IBrewable, IFeatureController, INarrativeElement {
  public readonly ItemType: string = 'npc';
  public ImageTag!: ImageTag.NPC;
  public CloudController: CloudController;
  public SaveController: SaveController;
  public PortraitController: PortraitController;
  public BrewController: BrewController;
  public FeatureController: FeatureController;
  public NpcFeatureController: NpcFeatureController;
  public NpcTemplateController: NpcTemplateController;
  public NpcClassController: NpcClassController;
  public NarrativeController: NarrativeController;
  public GroupController: GroupController;
  public StatController: StatController;

  private _id: string;
  private _name: string;
  private _subtitle: string;
  private _note: string;
  private _tag: string;
  static ID: string;
  static Name: string;

  public constructor(npcClass?: NpcClass, tier?: number) {
    const t = tier || 1;
    this._id = uuid();
    this.SaveController = new SaveController(this);
    this.PortraitController = new PortraitController(this);
    this.CloudController = new CloudController(this);
    this.BrewController = new BrewController(this);
    this.FeatureController = new FeatureController(this);
    this.NpcClassController = new NpcClassController(this);
    this.NpcFeatureController = new NpcFeatureController(this);
    this.NpcTemplateController = new NpcTemplateController(this);
    this.NarrativeController = new NarrativeController(this);
    this.GroupController = new GroupController(this);
    this.StatController = new StatController(this);

    this.FeatureController.Register();

    this._name = `New NPC`;
    this._subtitle = '';
    this._note = '';
    this._tag = 'Other';
    if (npcClass) this.NpcClassController.SetClass(npcClass, t);
  }

  // -- Passthroughs ------------------------------------------------------------------------------

  public get Items(): NpcItem[] {
    return this.NpcFeatureController.Items;
  }

  public get BrewableCollection(): CompendiumItem[] {
    if (!this.NpcClassController.HasClass) return [];
    // TODO / NB: temporary casting to CI prior to GM changes where they will become fully featured
    return [
      this.NpcClassController.Class as unknown as CompendiumItem,
      ...(this.NpcFeatureController.Features as unknown[] as CompendiumItem[]),
    ];
  }

  public get Labels(): string {
    return this.NarrativeController.LabelString;
  }

  public get Size(): string {
    if (this.StatController.Size === 0.5) return '½';
    return this.StatController.Size.toString();
  }

  public get Role(): string {
    if (!this.NpcClassController.Class) return 'None';
    return this.NpcClassController.Class.Role;
  }

  public get Tier(): string {
    if (!this.NpcClassController.Tier) return 'None';
    return this.NpcClassController.Tier.toString();
  }

  // public get Campaign(): string {
  //   return this.Campaign || 'None'
  // }

  public get Collection(): string {
    return this.GroupController.Group;
  }

  // -------------------------------------------------------------------------------------------------

  public get ID(): string {
    return this._id;
  }

  public RenewID(): void {
    this._id = uuid();
  }

  public get Name(): string {
    return this._name;
  }

  public set Name(val: string) {
    this._name = val;
    this.SaveController.save();
  }

  public get Subtitle(): string {
    return this._subtitle;
  }

  public set Subtitle(val: string) {
    this._subtitle = val;
    this.SaveController.save();
  }

  public get Note(): string {
    return this._note;
  }

  public set Note(val: string) {
    this._note = val;
    this.SaveController.save();
  }

  public get IsBiological(): boolean {
    return this._tag.toLowerCase() === 'biological';
  }

  public get Tag(): string {
    if (this.IsBiological) return 'Biological';
    return this._tag;
  }

  public set Tag(val: string) {
    this._tag = val;
  }

  setStatBonuses(): void {
    // TODO
    console.error('Not yet implemented');
    // this.Stats.ClearBonuses()
    // this.Items.forEach(item => {
    //   if (item.Feature.Override) {
    //     for (const key in item.Feature.Override) {
    //       const o = Array.isArray(item.Feature.Override[key])
    //         ? item.Feature.Override[key][item.Tier - 1]
    //         : item.Feature.Override[key]
    //       this.Stats.Overrides[key] = o
    //     }
    //   } else {
    //     if (item.Feature.Bonus) {
    //       for (const key in item.Feature.Bonus) {
    //         const b = Array.isArray(item.Feature.Bonus[key])
    //           ? item.Feature.Bonus[key][item.Tier - 1]
    //           : item.Feature.Bonus[key]
    //         this.Stats.Bonuses[key] += parseInt(b)
    //       }
    //     }
    //   }
    // })
  }

  public RecalcBonuses(save = true): void {
    this.setStatBonuses();
    // this.ResetStats()
    if (save) this.SaveController.save();
  }

  public get Portrait(): string {
    return this.PortraitController.Portrait;
  }

  public static Serialize(npc: Npc): INpcData {
    let data = {
      id: npc.ID,
      name: npc._name,
      subtitle: npc._subtitle,
      tag: npc._tag,
      note: npc._note,
    };

    SaveController.Serialize(npc, data);
    CloudController.Serialize(npc, data);
    PortraitController.Serialize(npc, data);
    BrewController.Serialize(npc, data);
    NpcClassController.Serialize(npc, data);
    NpcTemplateController.Serialize(npc, data);
    NpcFeatureController.Serialize(npc, data);
    NarrativeController.Serialize(npc, data);
    StatController.Serialize(npc, data);
    GroupController.Serialize(npc, data);

    return data as INpcData;
  }

  public Serialize(): INpcData {
    return Npc.Serialize(this);
  }

  public static AddNew(data: INpcData, sync?: boolean): Npc {
    const n = Npc.Deserialize(data);
    if (sync) n.CloudController.MarkSync();
    // getModule(NpcStore, store).addNpc(n);
    return n;
  }

  public Update(data: INpcData): void {
    this._id = data.id;
    this._name = data.name;
    this._subtitle = data.subtitle || '';
    this._tag = data.tag;
    this.RecalcBonuses(false);
    this._note = data.note;
  }

  public static Deserialize(data: INpcData): Npc {
    const npc = new Npc();
    try {
      npc.Update(data);
      SaveController.Deserialize(npc, data.save);
      PortraitController.Deserialize(npc, data.img);
      BrewController.Deserialize(npc, data);
      NpcClassController.Deserialize(npc, data);
      NpcTemplateController.Deserialize(npc, data);
      NpcFeatureController.Deserialize(npc, data);
      NarrativeController.Deserialize(npc, data.narrative);
      StatController.Deserialize(npc, data.stats);
      GroupController.Deserialize(npc, data.group);
      return npc;
    } catch (err) {
      console.error(err);
    }
    return npc;
  }

  public Clone(): Npc {
    const itemData = Npc.Serialize(this);
    const newItem = Npc.Deserialize(itemData);
    newItem.RenewID();
    newItem.Name += ' (COPY)';
    return newItem;
  }
}

export { INpcData, Npc };
