import uuid from 'uuid/v1'
import _ from 'lodash'
import { store } from '@/store'
import { Capacitor } from '@capacitor/core'
import { getImagePath, ImageTag } from '@/io/ImageManagement'
import {
  NpcStats,
  INpcStats,
  NpcClass,
  NpcTemplate,
  NpcFeature,
  NpcItem,
  INpcItemSaveData,
} from './'

interface INpcData {
  id: string
  class: string
  tier: number | string
  name: string
  campaign: string
  labels: string[]
  tag: string
  templates: string[]
  items: INpcItemSaveData[]
  stats: INpcStats
  note: string
  cloudImage: string
  localImage: string
  cc_ver: string
}

class Npc {
  private _id: string
  private _name: string
  private _campaign: string
  private _tier: string | number
  private _class: NpcClass
  private _templates: NpcTemplate[]
  private _items: NpcItem[]
  private _stats: NpcStats
  private _current_stats: NpcStats
  private _note: string
  private _cloud_image: string
  private _local_image: string
  private _tag: string
  private _user_labels: string[]
  private cc_ver: string

  public constructor(npcClass: NpcClass, tier?: number) {
    const t = tier || 1
    this._id = uuid()
    this._name = `New ${npcClass.Name[0].toUpperCase()}${npcClass.Name.slice(1)}`
    this._tier = t
    this._templates = []
    this._tag = 'Mech'
    this._user_labels = []
    this._note = this._cloud_image = this._local_image = this._campaign = ''
    this._class = npcClass
    this._stats = NpcStats.FromClass(npcClass, t)
    this._current_stats = NpcStats.FromClass(npcClass, t)
    this._items = []
    npcClass.BaseFeatures.forEach(f => {
      this._items.push(new NpcItem(f, t))
    })
    this.cc_ver = process.env.npm_package_version || 'UNKNOWN'
  }

  private save(): void {
    store.dispatch('npc/saveNpcData')
  }

  public get ID(): string {
    return this._id
  }

  public RenewID(): void {
    this._id = uuid()
  }

  public get Power(): number {
    // TODO: calc stat power for custom
    const multiplier = typeof this.Tier === 'number' ? this.Tier : 3.5
    return (this.Class.Power + this.Templates.reduce((a, b) => +a + +b.Power, 0)) * multiplier
  }

  public get PowerTier(): number {
    return Math.ceil(this.Power / 100) * 100
  }

  public get Stats(): NpcStats {
    return this._stats
  }

  public get CurrentStats(): NpcStats {
    return this._current_stats
  }

  public ResetStats(): void {
    this._current_stats = _.clone(this._stats)
  }

  public get Name(): string {
    return this._name
  }

  public set Name(val: string) {
    this._name = val
    this.save()
  }

  public get Campaign(): string {
    return this._campaign
  }

  public set Campaign(val: string) {
    this._campaign = val
    this.save()
  }

  public get Note(): string {
    return this._note
  }

  public set Note(val: string) {
    this._note = val
    this.save()
  }

  public get Tag(): string {
    return this._tag
  }

  public set Tag(val: string) {
    this._tag = val
  }

  public get Labels(): string[] {
    return this._user_labels
  }

  public set Labels(val: string[]) {
    this._user_labels = val
  }

  public get Tier(): number | string {
    return this._tier
  }

  public set Tier(newTier: number | string) {
    this._tier = newTier
    if (typeof newTier === 'number') {
      this._stats = NpcStats.FromClass(this.Class, newTier)
      this._items.forEach(i => {
        i.Tier = newTier
        this.setStatBonuses(i.Feature)
      })
    }
    this.save()
  }

  public get IsCustomTier(): boolean {
    return this._tier === 'custom'
  }

  public get Class(): NpcClass {
    return this._class
  }

  public get BaseClassFeatures(): NpcFeature[] {
    return this.Class.BaseFeatures
  }

  public get BaseTemplateFeatures(): NpcFeature[] {
    return this._templates.flatMap(x => x.BaseFeatures)
  }

  public get BaseFeatures(): NpcFeature[] {
    return this.BaseClassFeatures.concat(this.BaseTemplateFeatures)
  }

  public get SelectedFeatures(): NpcFeature[] {
    return this.Items.map(x => x.Feature)
  }

  public get Features(): NpcFeature[] {
    return this.BaseFeatures.concat(this.SelectedFeatures)
  }

  public get AvailableFeatures(): NpcFeature[] {
    return this.Class.OptionalFeatures.concat(
      this._templates.flatMap(x => x.OptionalFeatures)
    ).filter(x => !this.SelectedFeatures.some(y => y.ID === x.ID))
  }

  public get Templates(): NpcTemplate[] {
    return this._templates
  }

  public set Templates(temps: NpcTemplate[]) {
    this._templates = temps
  }

  public AddTemplate(temp: NpcTemplate): void {
    this._templates.push(temp)
    temp.BaseFeatures.forEach(f => {
      let t = typeof this.Tier === 'number' ? this.Tier : 1
      this._items.push(new NpcItem(f, t))
    })
    this.save()
  }

  public RemoveTemplate(temp: NpcTemplate): void {
    const idx = this._templates.findIndex(x => x.ID === temp.ID)
    if (idx > -1) {
      this._templates.splice(idx, 1)
      temp.BaseFeatures.forEach(f => {
        let j = this._items.findIndex(y => y.Feature.ID === f.ID)
        if (j > -1) this._items.splice(j, 1)
      })
      temp.OptionalFeatures.forEach(f => {
        let k = this._items.findIndex(z => z.Feature.ID === f.ID)
        if (k > -1) this._items.splice(k, 1)
      })
    }
    this.save()
  }

  setStatBonuses(feat: NpcFeature, remove?: boolean): void {
    if (feat.Bonus) {
      for (const key in feat.Bonus) {
        if (feat.Bonus.hasOwnProperty(key)) {
          if (remove) this._stats.Stats[key] -= feat.Bonus[key]
          else this._stats.Stats[key] += feat.Bonus[key]
        }
      }
    }
  }

  public AddFeature(feat: NpcFeature): void {
    const t = typeof this.Tier === 'number' ? this.Tier : 1
    this._items.push(new NpcItem(feat, t))
    this.setStatBonuses(feat)
    this.save()
  }

  public RemoveFeature(feat: NpcFeature): void {
    const j = this._items.findIndex(x => x.Feature.ID === feat.ID)
    if (j > -1) {
      this._items.splice(j, 1)
    }
    this.setStatBonuses(feat, true)
    this.save()
  }

  public get Items(): NpcItem[] {
    return this._items
  }

  public SetCloudImage(src: string): void {
    this._cloud_image = src
    this.save()
  }

  public get CloudImage(): string {
    return this._cloud_image
  }

  public SetLocalImage(src: string): void {
    this._local_image = src
    this.save()
  }

  public get LocalImage(): string {
    return this._local_image
  }

  public get Image(): string {
    if (this._cloud_image) return this._cloud_image
    else if (Capacitor.platform !== 'web' && this._local_image)
      return getImagePath(ImageTag.Mech, this._local_image)
    else return getImagePath(ImageTag.NPC, 'nodata.png', true)
  }

  public static Serialize(npc: Npc): INpcData {
    return {
      id: npc.ID,
      class: npc.Class.ID,
      tier: npc._tier,
      name: npc._name,
      campaign: npc._campaign,
      labels: npc._user_labels,
      tag: npc._tag,
      templates: npc.Templates.map(x => x.ID),
      items: npc._items.map(x => NpcItem.Serialize(x)),
      stats: NpcStats.Serialize(npc._stats),
      note: npc._note,
      cloudImage: npc._cloud_image,
      localImage: npc._local_image,
      cc_ver: npc.cc_ver,
    }
  }

  public static Deserialize(data: INpcData): Npc {
    const c = store.getters.referenceByID('NpcClasses', data.class)
    const npc = new Npc(c)
    npc._id = data.id
    npc._tier = data.tier
    npc._name = data.name
    npc._campaign = data.campaign
    npc._user_labels = data.labels
    npc._tag = data.tag
    npc._templates = data.templates.map(x => store.getters.referenceByID('NpcTemplate', x))
    npc._items = data.items.map(x => NpcItem.Deserialize(x))
    npc._note = data.note
    npc._cloud_image = data.cloudImage
    npc._local_image = data.localImage
    npc._stats = NpcStats.Deserialize(data.stats)
    npc.cc_ver = data.cc_ver
    return npc
  }
}

export { Npc, INpcData }
