import { Npc, NpcItem } from '../..'
import { NpcFeature } from './NpcFeature'

class NpcFeatureController {
  public readonly Parent: Npc
  private _items: NpcItem[]

  public constructor(parent: Npc) {
    this.Parent = parent
    this._items = []
  }

  public get BaseClassFeatures(): NpcFeature[] {
    if (!this.Parent.NpcClassController.Class) return []
    return this.Parent.NpcClassController.Class.BaseFeatures
  }

  public get BaseTemplateFeatures(): NpcFeature[] {
    if (!this.Parent.NpcTemplateController.Templates) return []
    return this.Parent.NpcTemplateController.Templates.flatMap(x => x.BaseFeatures)
  }

  public get BaseFeatures(): NpcFeature[] {
    return this.BaseClassFeatures.concat(this.BaseTemplateFeatures)
  }

  public get SelectedFeatures(): NpcFeature[] {
    return this._items.map(x => x.Feature)
  }

  public get Features(): NpcFeature[] {
    return this.BaseFeatures.concat(this.SelectedFeatures)
  }

  public get AvailableFeatures(): NpcFeature[] {
    return [
      ...this.Parent.NpcClassController.Class.OptionalFeatures,
      ...this.Parent.NpcTemplateController.Templates.flatMap(x => x.OptionalFeatures).filter(
        x => !this.SelectedFeatures.some(y => y.ID === x.ID)
      ),
    ]
  }

  public AddFeature(feat: NpcFeature, skipRecalc?: boolean): void {
    const item = new NpcItem(
      feat,
      this.Parent.NpcClassController.Tier,
      this.Parent.NpcTemplateController.Templates.find(x =>
        x.OptionalFeatures.some(y => y.ID === feat.ID)
      )
    )
    this._items.push(item)
    if (!skipRecalc) this.Parent.RecalcBonuses()
  }

  public RemoveFeature(feat: NpcFeature, skipRecalc?: boolean): void {
    const j = this._items.findIndex(x => x.Feature.ID === feat.ID)
    if (j > -1) {
      this._items.splice(j, 1)
      if (!skipRecalc) this.Parent.RecalcBonuses()
    }
  }

  public ResetFeatures() {
    this._items.splice(0, this._items.length)
    if (this.Parent.NpcClassController.Class)
      this.Parent.NpcClassController.Class.BaseFeatures.forEach(f => {
        this._items.push(new NpcItem(f, this.Parent.NpcClassController.Tier))
      })
    if (this.Parent.NpcTemplateController.Templates)
      this.Parent.NpcTemplateController.Templates.forEach(t => {
        t.BaseFeatures.forEach(f => {
          this._items.push(new NpcItem(f, this.Parent.NpcClassController.Tier))
        })
      })
    this.Parent.SaveController.save()
  }
}

export { NpcFeatureController }
