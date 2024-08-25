import { v4 as uuid } from 'uuid';
import { SaveController, CloudController, PortraitController } from '@/classes/components';
import { BrewController } from '@/classes/components/brew/BrewController';
import { IStatData, StatController } from '@/classes/components/combat/stats/StatController';
import { NarrativeController } from '@/classes/narrative/NarrativeController';
import { NpcData, Npc } from '../Npc';
import { INpcClassSaveData, NpcClassController } from '../class/NpcClassController';
import { INpcFeatureSaveData, NpcFeatureController } from '../feature/NpcFeatureController';
import { INpcTemplateSaveData, NpcTemplateController } from '../template/NpcTemplateController';
import { IStatContainer } from '@/classes/components/combat/stats/IStatContainer';
import { FolderController } from '@/classes/components/folder/FolderController';
import { IInstanceable } from '@/classes/components/instance/IInstanceable';
import { IInstanceableData } from '@/classes/components/instance/IInstancableData';
import { NpcStore } from '@/stores';
import {
  CompendiumItemInstance,
  CompendiumItemInstanceData,
} from '@/classes/CompendiumItemInstance';

class UnitData
  extends NpcData
  implements INpcClassSaveData, INpcFeatureSaveData, INpcTemplateSaveData, IInstanceableData
{
  npcType: 'unit' = 'unit';
  instance: boolean = false;
  instanceId: string | undefined;

  stats!: IStatData;
  class!: string | { Name: string; ID: string; Role: string };
  tier!: number;
  templates!: string[] | { Name: string; ID: string }[];

  subtitle!: string;
  tag!: string;
  features!: string[];
  instancedFeatures?: CompendiumItemInstanceData[];
}

class Unit extends Npc implements IStatContainer, IInstanceable {
  public IsInstance: boolean;
  public InstanceID?: string;

  public ItemType: string = 'Unit';
  private _tag: string = 'Mech';

  public NpcFeatureController: NpcFeatureController;
  public NpcTemplateController: NpcTemplateController;
  public NpcClassController: NpcClassController;
  public StatController: StatController;

  public MandatoryStats: string[] = [
    'activations',
    'size',
    'sizes',
    'structure',
    'hull',
    'agi',
    'sys',
    'eng',
    'hp',
    'armor',
    'stress',
    'heat',
    'speed',
    'evasion',
    'edef',
    'sensorRange',
    'saveTarget',
  ];

  public constructor(data?: UnitData) {
    super(data);
    this._name = data?.name || 'New NPC';
    this._tag = data?.tag || 'Mech';

    this.IsInstance = data?.instance || false;
    this.InstanceID = data?.instanceId;

    this.NpcClassController = new NpcClassController(this);
    this.NpcFeatureController = new NpcFeatureController(this);
    this.NpcTemplateController = new NpcTemplateController(this);
    this.StatController = new StatController(this);

    this.FeatureController.Register(this.NpcFeatureController);
  }

  public get IsBiological(): boolean {
    return this._tag.toLowerCase() === 'biological';
  }

  public get Tag(): string {
    return this._tag;
  }

  public set Tag(val: string) {
    this._tag = val;
    this.save();
  }

  public get TagIcon(): string {
    return this.IsBiological ? 'cc:biological' : `cc:${this.Tag.toLowerCase()}`;
  }

  public CreateInstance<UnitData>(): UnitData {
    const data = this.Serialize(true) as UnitData;
    this.SetInstanceProxies<UnitData>(data);
    (data as any).instanceId = uuid();

    return data;
  }

  SetInstanceProxies<T>(unitData: T) {
    const data = unitData as UnitData;

    data.class = {
      Name: this.NpcClassController.Class?.Name || '',
      ID: this.NpcClassController.Class?.ID || '',
      Role: this.NpcClassController.Class?.Role || '',
    };

    data.templates = this.NpcTemplateController.Templates.map((x) => ({ Name: x.Name, ID: x.ID }));
  }

  public get IsLinked(): boolean {
    return (
      this.GetLinkedItem<Npc>() !== undefined && !this.GetLinkedItem<Npc>().BrewController.HasError
    );
  }

  public GetLinkedItem<Npc>(): Npc {
    return NpcStore().getNpcByID(this.ID);
  }

  public static Serialize(unit: Unit, asInstance: boolean): UnitData {
    let data = {
      npcType: 'unit',
      id: unit.ID,
      instance: unit.IsInstance || asInstance,
      instanceId: unit.InstanceID,
      name: unit.Name,
      tag: unit.Tag,
      note: unit.Note,
      description: unit.Description,
      gmDescription: unit.GmDescription,
    } as UnitData;

    SaveController.Serialize(unit, data);
    CloudController.Serialize(unit, data);
    PortraitController.Serialize(unit, data);
    NpcTemplateController.Serialize(unit, data);
    NpcFeatureController.Serialize(unit, data);
    NpcClassController.Serialize(unit, data);
    NarrativeController.Serialize(unit, data);
    StatController.Serialize(unit, data);
    FolderController.Serialize(unit, data);
    BrewController.Serialize(unit, data);

    return data as UnitData;
  }

  public Serialize(asInstance: boolean = false): UnitData {
    return Unit.Serialize(this, asInstance);
  }

  public static Deserialize(data: UnitData): Unit {
    const unit = new Unit(data);
    SaveController.Deserialize(unit, data.save);
    PortraitController.Deserialize(unit, data.img);
    try {
      NpcClassController.Deserialize(unit, data as any);
    } catch (e) {
      Npc.LoadError(unit, e, 'Npc Class Controller');
    }
    try {
      NpcTemplateController.Deserialize(unit, data as any);
    } catch (e) {
      Npc.LoadError(unit, e, 'Npc Template Controller');
    }
    try {
      NpcFeatureController.Deserialize(unit, data as any);
    } catch (e) {
      Npc.LoadError(unit, e, 'Npc Feature Controller');
    }
    NarrativeController.Deserialize(unit, data.narrative);
    StatController.Deserialize(unit, data.stats);
    FolderController.Deserialize(unit, data.folder);
    BrewController.Deserialize(unit, data);
    return unit;
  }

  public Clone<Unit>(): Unit {
    const itemData = Unit.Serialize(this, false);
    const newItem = Unit.Deserialize(itemData);
    newItem.RenewID();
    newItem.Name += ' (COPY)';
    return newItem as Unit;
  }

  public get Icon(): string {
    if (this.NpcClassController.HasClass) return this.NpcClassController.Class!.Icon;
    return 'cc:encounter';
  }

  public get TierIcon(): string {
    return `cc:npc_tier_${this.NpcClassController.Tier || 1}`;
  }
}

export { UnitData, Unit };
