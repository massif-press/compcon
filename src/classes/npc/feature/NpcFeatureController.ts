import { CompendiumStore } from '@/stores';
import { Unit } from '../unit/Unit';
import { INpcFeatureData, NpcFeature } from './NpcFeature';
import { IFeatureContainer } from '@/classes/components/feature/IFeatureContainer';
import { NpcClass } from '../class/NpcClass';
import { NpcTemplate } from '../template/NpcTemplate';
import { NpcFeatureFactory } from './NpcFeatureFactory';

interface INpcFeatureSaveData {
  instance: boolean;
  features: { id: string; data: INpcFeatureData }[];
}

class NpcFeatureController implements IFeatureContainer {
  public readonly Parent: Unit;
  private _selectedFeatures: NpcFeature[] = [];

  public constructor(parent: Unit) {
    this.Parent = parent;
  }

  private get isInstance(): boolean {
    return this.Parent.IsInstance;
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
    return this._selectedFeatures;
  }

  public set Features(features: NpcFeature[]) {
    this._selectedFeatures = features;
    this.Parent.SaveController.save();
  }

  public get AvailableFeatures(): NpcFeature[] {
    let classFeatures = [] as NpcFeature[];

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
    this._selectedFeatures.push(feat);
    this.Parent.SaveController.save();
  }

  public GetModifiers(feat: NpcFeature): NpcFeature[] {
    return this.Features.filter((x) => x.Mod?._targetID === feat.ID);
  }

  public get Passives(): NpcFeature[] {
    return this.Features.filter((x) => x.Passive);
  }

  public RemoveFeature(feat: NpcFeature): void {
    let idx = this._selectedFeatures.findIndex((x) => x.ID === feat.ID);
    this._selectedFeatures.splice(idx, 1);

    this.Parent.SaveController.save();
  }

  public ClearFeatures(): void {
    this._selectedFeatures = [];
  }

  public ResetFeatures() {
    this._selectedFeatures = [];

    if (this.Parent.NpcClassController.HasClass)
      (this.Parent.NpcClassController.Class as NpcClass).BaseFeatures.forEach((f) => {
        this._selectedFeatures.push(f);
      });

    this.Parent.NpcTemplateController.Templates.forEach((t) => {
      (t as NpcTemplate).BaseFeatures.forEach((f) => {
        this._selectedFeatures.push(f);
      });
    });
    this.Parent.SaveController.save();
  }

  public static Serialize(parent: Unit, target: any) {
    target.features = parent.NpcFeatureController.Features.map((x) => ({
      id: x.ID,
      data: x.ItemData,
    }));
  }

  public static Deserialize(parent: Unit, data: INpcFeatureSaveData) {
    if (!parent.NpcFeatureController)
      throw new Error(
        `NpcClassController not found on parent (${typeof parent}). New NpcFeatureController must be instantiated in the parent's constructor method.`
      );

    parent.NpcFeatureController._selectedFeatures = data.features?.map((x) => {
      if (CompendiumStore().has('NpcFeatures', x.id)) {
        return CompendiumStore().referenceByID('NpcFeatures', x.id) as NpcFeature;
      } else return NpcFeatureFactory.Build(x.data);
    });
  }
}

export { NpcFeatureController };
export type { INpcFeatureSaveData };
