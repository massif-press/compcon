import { Unit } from '../unit/Unit';
import { NpcFeature } from './NpcFeature';
import { INpcItemSaveData, NpcItem } from './NpcItem/NpcItem';

interface INpcFeatureSaveData {
  items: INpcItemSaveData[];
}

class NpcFeatureController {
  public readonly Parent: Unit;
  private _items: NpcItem[];

  public constructor(parent: Unit) {
    this.Parent = parent;
    this._items = [];
  }

  public get Items(): NpcItem[] {
    return this._items;
  }

  public set Items(val: NpcItem[]) {
    this._items = val;
    // this.Parent.SaveController.save()
  }

  public get BaseClassFeatures(): NpcFeature[] {
    if (!this.Parent.NpcClassController.Class) return [];
    return this.Parent.NpcClassController.Class.BaseFeatures;
  }

  public get BaseTemplateFeatures(): NpcFeature[] {
    if (!this.Parent.NpcTemplateController.Templates) return [];
    return this.Parent.NpcTemplateController.Templates.flatMap((x) => x.BaseFeatures);
  }

  public get BaseFeatures(): NpcFeature[] {
    return this.BaseClassFeatures.concat(this.BaseTemplateFeatures);
  }

  public get SelectedFeatures(): NpcFeature[] {
    return this._items.map((x) => x.Feature);
  }

  public get Features(): NpcFeature[] {
    return this.BaseFeatures.concat(this.SelectedFeatures);
  }

  public get AvailableFeatures(): NpcFeature[] {
    return [];
    // return [
    //   ...this.Parent.NpcClassController.Class.OptionalFeatures,
    //   ...this.Parent.NpcTemplateController.Templates.flatMap((x) => x.OptionalFeatures).filter(
    //     (x) => !this.SelectedFeatures.some((y) => y.ID === x.ID)
    //   ),
    // ];
  }

  public AddFeature(feat: NpcFeature, skipRecalc?: boolean): void {
    const item = new NpcItem(
      feat,
      this.Parent.NpcClassController.Tier,
      this.Parent.NpcTemplateController.Templates.find((x) =>
        x.OptionalFeatures.some((y) => y.ID === feat.ID)
      )
    );
    this._items.push(item);
    // if (!skipRecalc) this.Parent.RecalcBonuses();
    this.Parent.SaveController.save();
  }

  public RemoveFeature(feat: NpcFeature, skipRecalc?: boolean): void {
    const j = this._items.findIndex((x) => x.Feature.ID === feat.ID);
    if (j > -1) {
      this._items.splice(j, 1);
      // if (!skipRecalc) this.Parent.RecalcBonuses();
    }
    this.Parent.SaveController.save();
  }

  public ResetFeatures() {
    this._items.splice(0, this._items.length);
    if (this.Parent.NpcClassController.Class)
      this.Parent.NpcClassController.Class.BaseFeatures.forEach((f) => {
        this._items.push(new NpcItem(f, this.Parent.NpcClassController.Tier));
      });
    if (this.Parent.NpcTemplateController.Templates)
      this.Parent.NpcTemplateController.Templates.forEach((t) => {
        t.BaseFeatures.forEach((f) => {
          this._items.push(new NpcItem(f, this.Parent.NpcClassController.Tier));
        });
      });
    this.Parent.SaveController.save();
  }

  public static Serialize(parent: Unit, target: any) {
    target.items = parent.NpcFeatureController._items.map((x) => NpcItem.Serialize(x));
  }

  public static Deserialize(parent: Unit, data: INpcFeatureSaveData) {
    if (!parent.NpcFeatureController)
      throw new Error(
        `NpcClassController not found on parent (${typeof parent}). New NpcFeatureController must be instantiated in the parent's constructor method.`
      );

    parent.NpcFeatureController._items = data.items.map((x) => NpcItem.Deserialize(x));
  }
}

export { NpcFeatureController };
export type { INpcFeatureSaveData };
