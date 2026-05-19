import { CompendiumStore } from '@/stores'
import { Unit } from '../unit/Unit'
import { INpcFeatureData, NpcFeature } from './NpcFeature'
import { IFeatureContainer } from '@/classes/components/feature/IFeatureContainer'
import { NpcClass } from '../class/NpcClass'
import { NpcTemplate } from '../template/NpcTemplate'
import { NpcFeatureFactory } from './NpcFeatureFactory'
import { Tag } from '@/class'

interface INpcFeatureSaveData {
  instance: boolean
  features: { id: string; data: INpcFeatureData }[]
}

class NpcFeatureController implements IFeatureContainer {
  public readonly Parent: Unit
  private _selectedFeatures: NpcFeature[] = []

  public constructor(parent: Unit) {
    this.Parent = parent
  }

  private get isInstance(): boolean {
    return this.Parent.IsInstance
  }

  get FeatureSource(): any[] {
    return this.Features
  }

  public get BaseClassFeatures(): NpcFeature[] {
    if (!this.Parent.NpcClassController.Class || this.isInstance) return []
    return (this.Parent.NpcClassController.Class as NpcClass).BaseFeatures.filter(
      x => !x.Deprecated
    )
  }

  public get BaseTemplateFeatures(): NpcFeature[] {
    if (!this.Parent.NpcTemplateController.Templates || this.isInstance) return []
    return this.Parent.NpcTemplateController.Templates.flatMap(x => x.BaseFeatures).filter(
      x => !x.Deprecated
    )
  }

  public get BaseFeatures(): NpcFeature[] {
    return this.BaseClassFeatures.concat(this.BaseTemplateFeatures)
  }

  public get Features(): NpcFeature[] {
    return this._selectedFeatures
  }

  public set Features(features: NpcFeature[]) {
    this._selectedFeatures = features
    this.Parent.SaveController.save()
  }

  public get AvailableFeatures(): NpcFeature[] {
    let classFeatures = [] as NpcFeature[]

    if (this.Parent.NpcClassController.HasClass) {
      classFeatures = (this.Parent.NpcClassController.Class as NpcClass)!.OptionalFeatures
      classFeatures = classFeatures.concat(
        (this.Parent.NpcClassController.Class as NpcClass)!.BaseFeatures.filter(
          x => !this.Features.some(y => y.ID === x.ID)
        )
      ) // Include base features that have been removed
    }

    const templateFeatures = this.Parent.NpcTemplateController.Templates.flatMap(
      x => x.OptionalFeatures
    )

    return classFeatures
      .concat(templateFeatures)
      .filter(x => !this.Features.some(y => y.ID === x.ID))
  }

  public AddFeature(feat: NpcFeature): void {
    this._selectedFeatures.push(NpcFeatureFactory.Build(feat.ItemData as INpcFeatureData))
    this.Parent.SaveController.save()
  }

  public GetModifiers(feat: NpcFeature): NpcFeature[] {
    return this.Features.filter(x => x.Mod === feat.ID)
  }

  public get Passives(): NpcFeature[] {
    return this.Features.filter(x => x.Passive)
  }

  public get AllTags(): Tag[] {
    return this.Features.flatMap(x => x.Tags)
  }

  public RemoveFeature(feat: NpcFeature): void {
    const idx = this._selectedFeatures.findIndex(x => x.ID === feat.ID)
    if (idx > -1) {
      this._selectedFeatures.splice(idx, 1)
      this.Parent.CloudController.stampTombstone(`features.${feat.ID}`)
      this.Parent.SaveController.save()
    }
  }

  public ReorderFeature(from: number, to: number): void {
    const item = this._selectedFeatures.splice(from, 1)[0]
    this._selectedFeatures.splice(to, 0, item)
    this.Parent.SaveController.save()
  }

  public ClearFeatures(): void {
    this._selectedFeatures = []
  }

  public ResetFeatures() {
    this._selectedFeatures = []

    if (this.Parent.NpcClassController.HasClass)
      (this.Parent.NpcClassController.Class as NpcClass).BaseFeatures.forEach(f => {
        this._selectedFeatures.push(NpcFeatureFactory.Build(f.ItemData as INpcFeatureData))
      })

    this.Parent.NpcTemplateController.Templates.forEach(t => {
      ;(t as NpcTemplate).BaseFeatures.forEach(f => {
        this._selectedFeatures.push(NpcFeatureFactory.Build(f.ItemData as INpcFeatureData))
      })
    })
    this.Parent.SaveController.save()
  }

  public static Serialize(parent: Unit, target: any) {
    const features = [] as { id: string; data: INpcFeatureData }[]
    parent.NpcFeatureController.Features.forEach(x => {
      const combatModifiedData = x.ItemData as any
      combatModifiedData.isUsed = x.Used
      combatModifiedData.flavorName = x.FlavorName || undefined
      combatModifiedData.flavorDescription = x.FlavorDescription || undefined

      features.push({
        id: x.ID,
        data: combatModifiedData as INpcFeatureData,
      })
    })
    target.features = features
  }

  public static Deserialize(parent: Unit, data: INpcFeatureSaveData) {
    if (!parent.NpcFeatureController)
      throw new Error(
        `NpcClassController not found on parent (${typeof parent}). New NpcFeatureController must be instantiated in the parent's constructor method.`
      )

    parent.NpcFeatureController._selectedFeatures = []
    data.features?.forEach(x => {
      const id = typeof x === 'string' ? x : x.id
      if (CompendiumStore().has('NpcFeatures', id)) {
        const ref = CompendiumStore().referenceByID('NpcFeatures', id) as NpcFeature
        const clone = NpcFeatureFactory.Build<NpcFeature>(ref.ItemData as INpcFeatureData)
        clone.Used = x.data?.isUsed || false
        if ((x.data as any)?.flavorName) clone.Name = (x.data as any).flavorName
        if ((x.data as any)?.flavorDescription) clone.FlavorDescription = (x.data as any).flavorDescription
        parent.NpcFeatureController._selectedFeatures.push(clone)
      } else if (!!x.data && Object.keys(x.data).length) {
        const built = NpcFeatureFactory.Build<NpcFeature>(x.data)
        if ((x.data as any)?.flavorName) built.Name = (x.data as any).flavorName
        parent.NpcFeatureController._selectedFeatures.push(built)
      }
    })
  }
}

export { NpcFeatureController }
export type { INpcFeatureSaveData }
