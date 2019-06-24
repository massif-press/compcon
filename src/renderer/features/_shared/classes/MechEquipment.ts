import store from '@/store'
import { LicensedItem, Tag } from '@/class'

abstract class MechEquipment extends LicensedItem {
  protected sp: number
  protected tags: ITagData[]
  private effect: string
  private integrated: boolean
  private notes: string[]
  private uses: number
  private destroyed: boolean

  constructor(itemData: any) {
    super(itemData)
    this.sp = itemData.sp || 0
    this.tags = itemData.tags
    this.effect = itemData.effect
    this.notes = []
    this.integrated = itemData.talent_item || itemData.frame_id || false
    this.uses = this.MaxUses
    this.destroyed = false
  }

  private save() {
    store.dispatch('saveData')
  }

  public get Tags(): Tag[] {
    return Tag.Deserialize(this.tags)
  }

  public get Effect(): string {
    return this.effect
  }

  public get IsIntegrated(): boolean {
    return this.integrated
  }

  public get IsUnique(): boolean {
    return this.Tags.some(x => x.IsUnique)
  }

  public get IsLimited(): boolean {
    return this.Tags.some(x => x.IsLimited)
  }

  public get IsDestroyed(): boolean {
    return this.destroyed
  }

  public Destroy() {
    this.destroyed = true
    this.save()
  }

  public Repair() {
    this.destroyed = false
    this.save()
  }

  public get Uses(): number {
    return this.uses
  }

  public set Uses(val: number) {
    this.uses = val
    this.save()
  }

  public get MaxUses(): number {
    if (!this.IsLimited) return 0
    const limVal = this.Tags.find(x => x.IsLimited).Value
    return typeof limVal === 'number' ? limVal : 0
  }

  public get Notes(): string[] {
    return this.notes
  }

  public set Notes(notes: string[]) {
    this.notes = notes
    this.save()
  }

  public AddNote(note: string) {
    this.notes.push(note)
    this.save()
  }

  public UpdateNote(index: number, note: string) {
    if (this.notes.length >= index) {
      this.notes.splice(index, 1, note)
      this.save()
    }
  }

  public DeleteNote(index: number) {
    if (this.notes.length >= index) {
      this.notes.splice(index, 1)
      this.save()
    }
  }
}

export default MechEquipment
