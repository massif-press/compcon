import { CompendiumStore } from '@/stores';
import { Unit } from '../unit/Unit';
import { NpcFeature } from './NpcFeature';
import { IFeatureContainer } from '@/classes/components/feature/IFeatureContainer';
import { INpcFeatureInstanceData, NpcFeatureInstance } from './NpcFeatureInstance';
import { CompendiumItemInstance } from '@/classes/CompendiumItemInstance';

interface INpcFeatureSaveData {
  features?: string[];
  instancedFeatures?: INpcFeatureInstanceData[];
}

class NpcFeatureController implements IFeatureContainer {
  public readonly Parent: Unit;
  private _selectedFeatures: string[] = [];
  private _instancedFeatures: NpcFeatureInstance[] = [];

  public constructor(parent: Unit) {
    this.Parent = parent;
  }

  public get InstancedFeatures(): NpcFeature[] {
    return this._instancedFeatures as unknown[] as NpcFeature[];
  }

  public get ReferencedFeatures(): NpcFeature[] {
    return this._selectedFeatures.map((x) =>
      CompendiumStore().NpcFeatures.find((y) => x === y.ID)
    ) as NpcFeature[];
  }

  get FeatureSource(): any[] {
    return this.Features;
  }

  public get BaseClassFeatures(): NpcFeature[] {
    if (!this.Parent.NpcClassController.Class) return [];
    return this.Parent.NpcClassController.Class.BaseFeatures.filter((x) => !x.Deprecated);
  }

  public get BaseTemplateFeatures(): NpcFeature[] {
    if (!this.Parent.NpcTemplateController.Templates) return [];
    return this.Parent.NpcTemplateController.Templates.flatMap((x) => x.BaseFeatures).filter(
      (x) => !x.Deprecated
    );
  }

  public get BaseFeatures(): NpcFeature[] {
    return this.BaseClassFeatures.concat(this.BaseTemplateFeatures);
  }

  public get Features(): NpcFeature[] {
    return this.InstancedFeatures.concat(this.ReferencedFeatures);
  }

  public get AvailableFeatures(): NpcFeature[] {
    let classFeatures = [] as NpcFeature[];
    if (this.Parent.NpcClassController.HasClass) {
      classFeatures = this.Parent.NpcClassController.Class!.OptionalFeatures;
    }

    const templateFeatures = this.Parent.NpcTemplateController.Templates.flatMap(
      (x) => x.OptionalFeatures
    );

    return classFeatures
      .concat(templateFeatures)
      .filter((x) => !this.Features.some((y) => y.ID === x.ID));
  }

  public AddFeature(feat: NpcFeature): void {
    this._selectedFeatures.push(feat.ID);
    this.Parent.SaveController.save();
  }

  public RemoveFeature(feat: NpcFeature): void {
    const j = this._selectedFeatures.findIndex((x) => x === feat.ID);
    if (j > -1) {
      this._selectedFeatures.splice(j, 1);
    }
    this.Parent.SaveController.save();
  }

  public ResetFeatures() {
    this._selectedFeatures = [];

    if (this.Parent.NpcClassController.HasClass)
      this.Parent.NpcClassController.Class!.BaseFeatures.forEach((f) => {
        this._selectedFeatures.push(f.ID);
      });

    this.Parent.NpcTemplateController.Templates.forEach((t) => {
      t.BaseFeatures.forEach((f) => {
        this._selectedFeatures.push(f.ID);
      });
    });
    this.Parent.SaveController.save();
  }

  public static Serialize(parent: Unit, target: any, instance: boolean) {
    if (instance) {
      const instancedAlready = parent.NpcFeatureController._instancedFeatures.map((x) =>
        x.Serialize()
      );

      const newInstances = parent.NpcFeatureController.ReferencedFeatures.map(
        (x) =>
          new NpcFeatureInstance({
            sourceId: x.ID,
            sourceType: x.ItemType,
            sourceData: CompendiumItemInstance.GetItemData(x.ID, x.ItemType),
            pack: x.LcpName,
          })
      ).map((x) => x.Serialize());

      target.instancedFeatures = instancedAlready.concat(newInstances);
    }
    target.features = parent.NpcFeatureController._selectedFeatures;
  }

  public static Deserialize(parent: Unit, data: INpcFeatureSaveData) {
    if (!parent.NpcFeatureController)
      throw new Error(
        `NpcClassController not found on parent (${typeof parent}). New NpcFeatureController must be instantiated in the parent's constructor method.`
      );

    parent.NpcFeatureController._selectedFeatures = data.features || [];
    parent.NpcFeatureController._instancedFeatures = data.instancedFeatures
      ? data.instancedFeatures.map((x) => new NpcFeatureInstance(x))
      : [];
  }
}

export { NpcFeatureController };
export type { INpcFeatureSaveData };
