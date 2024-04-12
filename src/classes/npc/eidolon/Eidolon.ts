import { v4 as uuid } from 'uuid';
import { CloudController, SaveController, PortraitController } from '@/classes/components';
import { BrewController } from '@/classes/components/brew/BrewController';
import { NarrativeController } from '@/classes/narrative/NarrativeController';
import { Npc, NpcData } from '../Npc';
import { CompendiumStore, NpcStore } from '@/stores';
import { IStatData } from '@/classes/components/combat/stats/StatController';
import { EidolonLayerInstanceSave, EidolonLayerSaveData } from './EidolonLayerSaveData';
import { FolderController } from '@/classes/components/folder/FolderController';
import { IInstanceableData } from '@/classes/components/instance/IInstancableData';
import { IInstanceable } from '@/classes/components/instance/IInstanceable';
import { EidolonLayer } from './EidolonLayer';

class EidolonData extends NpcData implements IInstanceableData {
  npcType: 'eidolon' = 'eidolon';
  instance: boolean = false;
  instanceId: string | undefined;

  tier!: number;
  layer_data!: {
    id: string;
    description: string;
    stats: IStatData;
  }[];

  layer_instance_data?: EidolonLayerInstanceSave[];
}

class Eidolon extends Npc implements IInstanceable {
  public IsInstance: boolean;
  public InstanceID?: string;

  public readonly ItemType: string = 'Eidolon';
  private _tier: number;

  private _layers: EidolonLayerSaveData[];

  public constructor(data?: EidolonData) {
    super(data);
    this._name = data?.name || 'New Eidolon';

    this.IsInstance = data?.instance || false;
    this.InstanceID = data?.instanceId;

    this._tier = data?.tier || 1;

    this._layers = [];

    if (data) {
      if (!data.instance && data.layer_data) {
        this._layers = data.layer_data.map((l) => new EidolonLayerSaveData(l, this));
      } else if (data.instance && data.layer_instance_data) {
        console.log(data.layer_instance_data);
        this._layers =
          data.layer_instance_data.map((l) => EidolonLayerSaveData.Deserialize(l, this)) || [];
      }
    }

    if (!data || this._layers.length === 0)
      this._layers.push(new EidolonLayerSaveData({ id: 'el_core', description: '' }, this));
  }

  public CreateInstance<EidolonData>(): EidolonData {
    const data = this.Serialize(true) as EidolonData;
    this.SetInstanceProxies<EidolonData>(data);
    (data as any).instanceId = uuid();

    return data;
  }

  SetInstanceProxies<T>(eData: T) {
    const data = eData as EidolonData;

    data.layer_instance_data = this._layers.map((l) => l.Serialize(true));
    console.log(data.layer_instance_data);
  }

  public get IsLinked(): boolean {
    return this.GetLinkedItem<Npc>() !== undefined;
  }

  public GetLinkedItem<Npc>(): Npc {
    return NpcStore().getNpcByID(this.ID);
  }

  public get Tier(): number {
    return this._tier;
  }

  public set Tier(newTier: number) {
    this._tier = newTier;

    this._layers.forEach((l) => {
      l.ResetStats();
    });

    this.save();
  }

  public get Class() {
    const l = this._layers.length - 1;
    if (l < 3) return '0';
    if (l > 5) return '3+';
    return (l - 2).toString();
  }

  public get Layers(): EidolonLayerSaveData[] {
    return this._layers;
  }

  public AddLayer(id: string) {
    this._layers.push(new EidolonLayerSaveData({ id, description: '' }, this));
  }

  public ClearLayers() {
    this._layers = [];
  }

  public AddRandomLayer() {
    const availableLayers = CompendiumStore().EidolonLayers.filter(
      (l) => !this._layers.some((x) => (x.Layer as EidolonLayer).ID === l.ID)
    );
    const l = availableLayers[Math.floor(Math.random() * availableLayers.length)];
    if (l) this._layers.push(new EidolonLayerSaveData({ id: l.ID, description: '' }, this));
  }

  public RemoveLayer(index: number) {
    if (index > -1) this._layers.splice(index, 1);
  }

  public static Serialize(eidolon: Eidolon, asInstance: boolean): EidolonData {
    let data = {
      npcType: 'eidolon',
      id: eidolon.ID,
      instance: eidolon.IsInstance || asInstance,
      instanceId: eidolon.InstanceID,
      name: eidolon.Name,
      note: eidolon.Note,
      tier: eidolon.Tier,
      layer_data: [] as any[],
    } as EidolonData;

    if (eidolon.IsInstance || asInstance) {
      data.layer_data = [];
      data.layer_instance_data = eidolon._layers.map((layer) => layer.Serialize(true));
    } else {
      eidolon._layers.forEach((layer) => {
        data.layer_data.push({
          id: (layer.Layer as EidolonLayer).ID,
          description: layer.Description,
          stats: EidolonLayerSaveData.Serialize(layer, false),
        });
      });
    }

    SaveController.Serialize(eidolon, data);
    CloudController.Serialize(eidolon, data);
    PortraitController.Serialize(eidolon, data);
    BrewController.Serialize(eidolon, data);
    NarrativeController.Serialize(eidolon, data);
    FolderController.Serialize(eidolon, data);

    return data as EidolonData;
  }

  public Serialize<EidolonData>(asInstance: boolean = false): EidolonData {
    return Eidolon.Serialize(this, asInstance) as EidolonData;
  }

  public static Deserialize(data: EidolonData): Eidolon {
    const eidolon = new Eidolon(data);

    SaveController.Deserialize(eidolon, data.save);
    PortraitController.Deserialize(eidolon, data.img);
    BrewController.Deserialize(eidolon, data);
    NarrativeController.Deserialize(eidolon, data.narrative);
    FolderController.Deserialize(eidolon, data.folder);
    return eidolon;
  }

  public Clone<Eidolon>(): Eidolon {
    const itemData = Eidolon.Serialize(this, false);
    const newItem = Eidolon.Deserialize(itemData);
    newItem.RenewID();
    newItem.Name += ' (COPY)';
    return newItem as Eidolon;
  }

  public get Icon(): string {
    return 'cc:monist';
  }

  public get TagIcon(): string {
    return 'cc:monist';
  }
}

export { Eidolon, EidolonData };
