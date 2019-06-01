import { LicensedItem, Tag } from "@/class";

abstract class MechEquipment extends LicensedItem {
  protected sp: number;
  protected tags: ITagData[];
  private effect: string;
  private integrated: boolean;
  private notes: string[];

  constructor(itemData: any) {
    super(itemData);
    this.sp = itemData.sp || 0;
    this.tags = itemData.tags;
    this.effect = itemData.effect;
    this.notes = [];
    this.integrated = itemData.talent_item || itemData.frame_id || false;
  }

  public get SP(): number {
    return this.sp;
  }

  public get Tags(): Tag[] {
    return Tag.Deserialize(this.tags);
  }

  public get Effect(): string {
    return this.effect;
  }

  public get IsIntegrated(): boolean {
    return this.integrated;
  }

  public get Notes(): string[] {
    return this.notes;
  }

  public set Notes(notes: string[]) {
    this.notes = notes;
  }

  public AddNote(note: string) {
    this.notes.push(note);
  }

  public DeleteNote(index: number) {
    if (this.notes.length >= index) {
      this.notes.splice(index, 1);
    }
  }
}

export default MechEquipment;