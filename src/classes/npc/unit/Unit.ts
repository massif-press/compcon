import { SaveController, CloudController, PortraitController } from '@/classes/components';
import { BrewController } from '@/classes/components/brew/BrewController';
import { IStatData, StatController } from '@/classes/components/combat/stats/StatController';
import { NarrativeController } from '@/classes/narrative/NarrativeController';
import { NpcData, Npc } from '../Npc';
import { INpcClassSaveData, NpcClassController } from '../class/NpcClassController';
import { INpcFeatureSaveData, NpcFeatureController } from '../feature/NpcFeatureController';
import { NpcTemplateController } from '../template/NpcTemplateController';
import { IStatContainer } from '@/classes/components/combat/stats/IStatContainer';
import { FolderController } from '@/classes/components/folder/FolderController';

class UnitData extends NpcData implements INpcClassSaveData, INpcFeatureSaveData {
  npcType: 'unit' = 'unit';
  stats!: IStatData;

  class!: string;
  tier!: number;
  subtitle!: string;
  tag!: string;
  templates!: string[];
  features!: string[];
}

class Unit extends Npc implements IStatContainer {
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
    'hp',
    'armor',
    'stress',
    'heat',
    'speed',
    'evasion',
    'edef',
    'sensorRange',
    'saveTarget',
    'hull',
    'agi',
    'sys',
    'eng',
  ];

  public ItemType: string = 'Unit';

  public constructor(data?: UnitData) {
    super(data);
    this._name = data?.name || 'New NPC';
    this._tag = data?.tag || 'Mech';

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
    this.SaveController.save();
  }

  public static Serialize(unit: Unit): UnitData {
    let data = {
      npcType: 'unit',
      id: unit.ID,
      name: unit.Name,
      tag: unit.Tag,
      note: unit.Note,
      description: unit.Description,
      gmDescription: unit.GmDescription,
    };

    SaveController.Serialize(unit, data);
    CloudController.Serialize(unit, data);
    PortraitController.Serialize(unit, data);
    BrewController.Serialize(unit, data);
    NpcTemplateController.Serialize(unit, data);
    NpcFeatureController.Serialize(unit, data);
    NpcClassController.Serialize(unit, data);
    NarrativeController.Serialize(unit, data);
    StatController.Serialize(unit, data);
    FolderController.Serialize(unit, data);

    return data as UnitData;
  }

  public Serialize<UnitData>(): UnitData {
    return Unit.Serialize(this) as UnitData;
  }

  public static Deserialize(data: UnitData): Unit {
    const unit = new Unit(data);
    SaveController.Deserialize(unit, data.save);
    PortraitController.Deserialize(unit, data.img);
    BrewController.Deserialize(unit, data);
    NpcClassController.Deserialize(unit, data);
    NpcTemplateController.Deserialize(unit, data);
    NpcFeatureController.Deserialize(unit, data);
    NarrativeController.Deserialize(unit, data.narrative);
    StatController.Deserialize(unit, data.stats);
    FolderController.Deserialize(unit, data.folder);
    return unit;
  }

  public Clone<Unit>(): Unit {
    const itemData = Unit.Serialize(this);
    const newItem = Unit.Deserialize(itemData);
    newItem.RenewID();
    newItem.Name += ' (COPY)';
    return newItem as Unit;
  }
}

export { UnitData, Unit };
