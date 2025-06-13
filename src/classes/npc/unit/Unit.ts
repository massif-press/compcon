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
import { CompendiumStore, NpcStore } from '@/stores';
import { INpcFeatureData } from '../feature/NpcFeature';
import { INpcTemplateData } from '../template/NpcTemplate';
import { INpcClassData } from '../class/NpcClass';

class UnitData
  extends NpcData
  implements INpcClassSaveData, INpcFeatureSaveData, INpcTemplateSaveData
{
  npcType: 'unit' = 'unit';

  stats!: IStatData;
  class!: { id: string; data: INpcClassData };
  tier!: number;
  templates: { id: string; data: INpcTemplateData }[] = [];

  subtitle: string = '';
  tag: string = 'Mech';
  features: { id: string; data: INpcFeatureData }[] = [];
}

class Unit extends Npc implements IStatContainer, IInstanceable {
  public IsInstance: boolean;
  public InstanceID: string;
  public OriginId: string;

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
    'overshield',
    'overcharge',
  ];

  public constructor(data?: UnitData) {
    super(data);
    this._name = data?.name || '';
    this._tag = data?.tag || 'Mech';

    this.IsInstance = data?.instance || false;
    this.InstanceID = data?.instanceId || '';
    this.OriginId = data?.originId || '';

    this.NpcClassController = new NpcClassController(this);
    this.NpcFeatureController = new NpcFeatureController(this);
    this.NpcTemplateController = new NpcTemplateController(this);
    this.StatController = new StatController(this);

    this.FeatureController.Register(this.NpcFeatureController);
    this.CloudController = new CloudController(this);
  }

  public get Name(): string {
    if (this._name) return this._name;
    return this.DefaultName;
  }

  public set Name(val: string) {
    this._name = val;
    this.save();
  }

  public get DefaultName(): string {
    return `T${this.NpcClassController.Tier} ${this.NpcTemplateController.Templates.map((x) => x.Name).join(' ')} ${this.NpcClassController.Class?.Name || 'NPC'} ${this.Tag}`;
  }

  public get IsNameless(): boolean {
    return !this._name;
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
    const data = this.Serialize() as any;
    (data as any).instanceId = uuid();
    data.originId = this.ID;
    data.id = data.instanceId;
    data.instance = true;

    return data as UnitData;
  }

  public get IsLinked(): boolean {
    return (
      this.GetLinkedItem<Npc>() !== undefined && !this.GetLinkedItem<Npc>().BrewController.HasError
    );
  }

  public GetLinkedItem<Npc>(): Npc {
    return NpcStore().getNpcByID(this.OriginId);
  }

  public static Serialize(unit: Unit, asInstance: boolean): UnitData {
    let data = {
      npcType: 'unit',
      id: unit.ID,
      instance: unit.IsInstance || asInstance,
      instanceId: unit.InstanceID,
      originId: unit.OriginId,
      name: unit._name,
      tag: unit.Tag,
      note: unit.Note,
      description: unit.Description,
      gmDescription: unit.GmDescription,
    } as UnitData;

    // TODO: this shouldn't be an object, have to find why it is being polluted
    if (typeof data.instance === 'object') data.instance = false;

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
    BrewController.Deserialize(unit, data);
    PortraitController.Deserialize(unit, data.img);
    if (!CompendiumStore().hasNpcAccess) unit.BrewController.MissingContent = true;
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
    return unit;
  }

  public Clone<Unit>(): Unit {
    const itemData = Unit.Serialize(this, false);
    const newItem = Unit.Deserialize(itemData);
    newItem.RenewID();
    if (newItem._name) newItem._name += ' (COPY)';
    return newItem as Unit;
  }

  public get Icon(): string {
    if (this.NpcClassController.HasClass) return this.NpcClassController.Class!.Icon;
    return 'cc:encounter';
  }

  public get TierIcon(): string {
    return `cc:npc_tier_${this.NpcClassController.Tier || 1}`;
  }

  public get SizeIcon(): string {
    if (!this.StatController.getStat('size')) return 'cc:size_1';
    return `cc:size_${this.StatController.getStat('size') === 0.5 ? 'half' : this.StatController.getStat('size')}`;
  }
}

export { UnitData, Unit };
