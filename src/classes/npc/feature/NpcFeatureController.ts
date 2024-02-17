import { CompendiumStore } from '@/stores';
import { Unit } from '../unit/Unit';
import { NpcFeature } from './NpcFeature';
import { INpcItemSaveData, NpcItem } from './NpcItem/NpcItem';

interface INpcFeatureSaveData {
  features: string[];
}

class NpcFeatureController {
  public readonly Parent: Unit;
  private _selectedFeatures: string[];

  public constructor(parent: Unit) {
    this.Parent = parent;
    this._selectedFeatures = [];
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
    return this._selectedFeatures.map((x) =>
      CompendiumStore().NpcFeatures.find((y) => x === y.ID)
    ) as NpcFeature[];
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

  public static Serialize(parent: Unit, target: any) {
    target.features = parent.NpcFeatureController._selectedFeatures;
  }

  public static Deserialize(parent: Unit, data: INpcFeatureSaveData) {
    if (!parent.NpcFeatureController)
      throw new Error(
        `NpcClassController not found on parent (${typeof parent}). New NpcFeatureController must be instantiated in the parent's constructor method.`
      );

    parent.NpcFeatureController._selectedFeatures = data.features || [];
  }
}

export { NpcFeatureController };
export type { INpcFeatureSaveData };
