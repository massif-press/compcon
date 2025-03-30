import { CompendiumStore } from '@/stores';
import { Unit } from '../unit/Unit';
import { INpcFeatureData, NpcFeature } from './NpcFeature';
import { IFeatureContainer } from '@/classes/components/feature/IFeatureContainer';
import { NpcClass } from '../class/NpcClass';
import { NpcTemplate } from '../template/NpcTemplate';
import {
  CompendiumItemInstance,
  CompendiumItemInstanceData,
} from '@/classes/CompendiumItemInstance';
import { NpcFeatureFactory } from './NpcFeatureFactory';

interface INpcFeatureSaveData {
  instance: boolean;
  features?: string[];
  instancedFeatures?: CompendiumItemInstanceData[];
}

class NpcFeatureController implements IFeatureContainer {
  public readonly Parent: Unit;
  private _selectedFeatures: string[] = [];
  private _instancedFeatures: NpcFeature[] = [];

  public constructor(parent: Unit) {
    this.Parent = parent;
  }

  private get isInstance(): boolean {
    return this.Parent.IsInstance;
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
    if (!this.Parent.NpcClassController.Class || this.isInstance) return [];
    return (this.Parent.NpcClassController.Class as NpcClass).BaseFeatures.filter(
      (x) => !x.Deprecated
    );
  }

  public get BaseTemplateFeatures(): NpcFeature[] {
    if (!this.Parent.NpcTemplateController.Templates || this.isInstance) return [];
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
    if (this.isInstance) return classFeatures;

    if (this.Parent.NpcClassController.HasClass) {
      classFeatures = (this.Parent.NpcClassController.Class as NpcClass)!.OptionalFeatures;
      classFeatures = classFeatures.concat(
        (this.Parent.NpcClassController.Class as NpcClass)!.BaseFeatures.filter(
          (x) => !this.Features.some((y) => y.ID === x.ID)
        )
      ); // Include base features that have been removed
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

  public GetModifiers(feat: NpcFeature): NpcFeature[] {
    return this.Features.filter((x) => x.Mod?._targetID === feat.ID);
  }

  public get Passives(): NpcFeature[] {
    return this.Features.filter((x) => x.Passive);
  }

  public RemoveFeature(feat: NpcFeature): void {
    let j = this._selectedFeatures.findIndex((x) => x === feat.ID);
    if (j > -1) {
      this._selectedFeatures.splice(j, 1);
    }
    j = this._instancedFeatures.findIndex((x) => x.ID === feat.ID);
    if (j > -1) {
      this._instancedFeatures.splice(j, 1);
    }

    this.Parent.SaveController.save();
  }

  public ClearFeatures(): void {
    this._selectedFeatures = [];
    this._instancedFeatures = [];
  }

  public ResetFeatures() {
    if (this.isInstance) return;
    this._selectedFeatures = [];

    if (this.Parent.NpcClassController.HasClass)
      (this.Parent.NpcClassController.Class as NpcClass).BaseFeatures.forEach((f) => {
        this._selectedFeatures.push(f.ID);
      });

    this.Parent.NpcTemplateController.Templates.forEach((t) => {
      (t as NpcTemplate).BaseFeatures.forEach((f) => {
        this._selectedFeatures.push(f.ID);
      });
    });
    this.Parent.SaveController.save();
  }

  public static Serialize(parent: Unit, target: any) {
    if (target.instance) {
      target.instancedFeatures = parent.NpcFeatureController.Features.map((x) =>
        new CompendiumItemInstance(x).Serialize()
      );

      target.features = [];
    } else target.features = parent.NpcFeatureController._selectedFeatures;
  }

  public static Deserialize(parent: Unit, data: INpcFeatureSaveData) {
    if (!parent.NpcFeatureController)
      throw new Error(
        `NpcClassController not found on parent (${typeof parent}). New NpcFeatureController must be instantiated in the parent's constructor method.`
      );

    if (data.instance) {
      parent.NpcFeatureController._instancedFeatures =
        data.instancedFeatures?.map((x) =>
          NpcFeatureFactory.Build(x.sourceData as INpcFeatureData)
        ) || [];
    }

    parent.NpcFeatureController._selectedFeatures = data.features || [];
  }
}

export { NpcFeatureController };
export type { INpcFeatureSaveData };
