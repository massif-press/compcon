import { Damage, Range } from '@/class';
import { CompendiumStore } from '@/stores';
import { NpcFeature } from './NpcFeature';
import { NpcFeatureFactory } from './NpcFeatureFactory';
import { IInstanceData } from '@/classes/components/instance/IInstanceData';
import { IInstance } from '@/classes/components/instance/IInstance';
import { NpcTech } from './NpcItem/NpcTech';
import { NpcWeapon } from './NpcItem/NpcWeapon';
import { CompendiumItemInstance } from '@/classes/CompendiumItemInstance';

interface INpcFeatureInstanceData extends IInstanceData {
  pack: string;
}

class NpcFeatureInstance extends CompendiumItemInstance implements IInstance {
  public constructor(data: INpcFeatureInstanceData) {
    super(data);
    this.Item = NpcFeatureFactory.Build<NpcFeature>(this.SourceData, data.pack);
  }

  public get Source(): NpcFeature | undefined {
    const feature = CompendiumStore().NpcFeatures.find((x) => x.ID === this.SourceId);
    return feature;
  }

  public get IsLinked(): boolean {
    return !!this.Source;
  }

  LinkSource(id: string): void {
    this.SourceId = id;
  }

  UnlinkSource(): void {
    this.SourceId = '';
  }

  // NPC Feature Fields

  public get FeatureType(): string {
    return (this.Item as NpcFeature).FeatureType;
  }

  public get Base(): boolean {
    return (this.Item as NpcFeature).Base;
  }

  public get HideActive(): boolean {
    return (this.Item as NpcFeature).HideActive;
  }

  public get Color(): string {
    return (this.Item as NpcFeature).Color;
  }

  public get Icon(): string {
    return (this.Item as NpcFeature).Icon;
  }

  public get HasAccuracy(): boolean {
    return (this.Item as NpcTech).HasAccuracy;
  }

  public get HasAttackBonus(): boolean {
    return (this.Item as NpcTech).HasAttackBonus;
  }

  public get Range(): Range[] {
    return (this.Item as NpcWeapon).Range;
  }

  // Npc Feature Methods

  public Accuracy(tier: number): number {
    return (this.Item as NpcTech).Accuracy(tier);
  }

  public AttackBonus(tier: number): number {
    return (this.Item as NpcTech).AttackBonus(tier);
  }

  public Damage(tier: number): Damage[] {
    return (this.Item as NpcWeapon).Damage(tier);
  }

  // Serialization
  public static Serialize(instance: CompendiumItemInstance): INpcFeatureInstanceData {
    return {
      ...CompendiumItemInstance.Serialize(instance),
      pack: (instance.Item as CompendiumItemInstance).LcpName,
    };
  }

  public Serialize(): IInstanceData {
    return NpcFeatureInstance.Serialize(this);
  }

  public static Deserialize(data: IInstanceData): IInstance {
    return new NpcFeatureInstance(data as INpcFeatureInstanceData);
  }

  public Clone(): NpcFeatureInstance {
    return new NpcFeatureInstance(this.Serialize() as INpcFeatureInstanceData);
  }
}

export { NpcFeatureInstance };
export type { INpcFeatureInstanceData };
