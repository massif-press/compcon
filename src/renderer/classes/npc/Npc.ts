import uuid from 'uuid/v1'
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
import { Tag } from '@/class'

interface INpcData {
  id: string
  class: string
  tier: number | string
  name: string
  campaign: string
  labels: string[]
  tags: ITagData[]
  templates: string[]
  items: INpcItemSaveData[]
  selectedFeatures: string[]
  stats: INpcStats
  note: string
  cloudImage: string
  localImage: string
}

class Npc {
  private _id: string
  private _name: string
  private _campaign: string
  private _tier: string | number
  private _class: NpcClass
  private _templates: NpcTemplate[]
  private _selected_features: NpcFeature[]
  private _items: NpcItem[]
  private _stats: NpcStats
  private _note: string
  private _cloud_image: string
  private _local_image: string
  private _npc_tags: Tag[]
  private _user_labels: string[]

  public constructor(npcClass: NpcClass) {
    this._id = uuid()
    this._name = `New ${npcClass.Name}`
    this._tier = 1
    this._templates = []
    this._npc_tags = []
    this._user_labels = []
    this._note = this._cloud_image = this._local_image = this._campaign = ''
    this._class = npcClass
    this._stats = NpcStats.FromClass(npcClass, 1)
    npcClass.BaseFeatures.forEach(f => {
      this._items.push(new NpcItem(f, 1))
    })
  }

  private save(): void {
    store.dispatch('saveData')
  }

  public get ID(): string {
    return this._id
  }

  public get Power(): number {
    return 100
  }

  public get Stats(): NpcStats {
    return this._stats
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

  public get Tags(): Tag[] {
    return this._npc_tags
  }

  public AddTag(tag: Tag): void {
    this._npc_tags.push(tag)
    this.save()
  }

  public RemoveTag(tag: Tag): void {
    const idx = this._npc_tags.findIndex(x => x.ID === tag.ID)
    if (idx > -1) this._npc_tags.splice(idx, 1)
    this.save()
  }

  public get Labels(): string[] {
    return this._user_labels
  }

  public AddLabel(label: string): void {
    this._user_labels.push(label)
    this.save()
  }

  public RemoveLabel(label: string): void {
    const idx = this._user_labels.indexOf(label)
    if (idx > -1) this._user_labels.splice(idx, 1)
    this.save()
  }

  public get Tier(): number | string {
    return this._tier
  }

  public set Tier(newTier: number | string) {
    this._tier = newTier
    if (typeof newTier === 'number') {
      this._stats = NpcStats.FromClass(this.Class, newTier)
      this._items.forEach(f => {
        f.Tier = newTier
      })
    }
    this.save()
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
    return this._selected_features
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
    for (const attr in temp.StatBonus) {
      if (temp.StatBonus.hasOwnProperty(attr)) {
        this._stats[
          Object.keys(this._stats).find(key => key.toLowerCase() === attr.toLowerCase())
        ] += temp.StatBonus[attr]
      }
    }
    this.save()
  }

  public RemoveTemplate(temp: NpcTemplate): void {
    const idx = this._templates.findIndex(x => x.ID === temp.ID)
    if (idx > -1) {
      this._templates.splice(idx, 1)
      temp.BaseFeatures.forEach(f => {
        let j = this._items.findIndex(y => y.Item.ID === f.ID)
        if (j > -1) this._items.splice(j, 1)
      })
      temp.OptionalFeatures.forEach(f => {
        let k = this._items.findIndex(z => z.Item.ID === f.ID)
        if (k > -1) this._items.splice(k, 1)
      })
      for (const attr in temp.StatBonus) {
        if (temp.StatBonus.hasOwnProperty(attr)) {
          this._stats[
            Object.keys(this._stats).find(key => key.toLowerCase() === attr.toLowerCase())
          ] -= temp.StatBonus[attr]
        }
      }
    }
    this.save()
  }

  public AddFeature(feat: NpcFeature): void {
    this._selected_features.push(feat)
    const t = typeof this.Tier === 'number' ? this.Tier : 1
    this._items.push(new NpcItem(feat, t))
    this.save()
  }

  public RemoveFeature(feat: NpcFeature): void {
    const i = this._selected_features.findIndex(x => x.ID === feat.ID)
    if (i > -1) {
      this._selected_features.splice(i, 1)
    }
    const j = this._items.findIndex(x => x.Item.ID === feat.ID)
    if (j > -1) {
      this._items.splice(j, 1)
    }
    this.save()
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
      tier: npc.Tier,
      name: npc.Name,
      campaign: npc.Campaign,
      labels: npc.Labels,
      tags: npc.Tags.map(x => ({ id: x.ID, val: '' })),
      templates: npc.Templates.map(x => x.ID),
      items: npc._items.map(x => NpcItem.Serialize(x)),
      selectedFeatures: npc.SelectedFeatures.map(x => x.ID),
      stats: NpcStats.Serialize(npc.Stats),
      note: npc.Note,
      cloudImage: npc._cloud_image,
      localImage: npc._local_image,
    }
  }

  public static Deserialize(data: INpcData): Npc {
    const c = store.getters.referenceByID('NpcClass', data.class)
    const npc = new Npc(c)
    npc._id = data.id
    npc._tier = data.tier
    npc._name = data.name
    npc._campaign = data.campaign
    npc._user_labels = data.labels
    npc._npc_tags = Tag.Deserialize(data.tags)
    npc._templates = data.templates.map(x => store.getters.referenceByID('NpcTemplate', x))
    npc._items = data.items.map(x => NpcItem.Deserialize(x))
    npc._selected_features = data.selectedFeatures.map(x =>
      store.getters.referenceByID('NpcFeature', x)
    )
    npc._note = data.note
    npc._cloud_image = data.cloudImage
    npc._local_image = data.localImage
    npc._stats = NpcStats.Deserialize(data.stats)
    return npc
  }
}

export default Npc
