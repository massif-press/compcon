import { ItemType } from '@/class'

class Tag {
  private id: string;
  private name: string;
  private description: string;
  private val: number | string;
  private item_type: ItemType;
  private brew: string;

  constructor(tagData: any) {
    this.id = tagData.id;
    this.name = tagData.name;
    this.description = tagData.description;
    this.item_type = ItemType.None;
    this.brew = tagData.brew || "Core";
    this.val = tagData.val || "";
    this.item_type = ItemType.Tag;
  }

  public Description(bonus: number): string {
    if (!this.val) return this.description;
    if (typeof this.val === "number") {
      return this.description.replace(/{VAL}/g, (this.val + bonus).toString());
    } else {
      var str = this.val as string;
      if (str.includes("+")) {
        const split = str.split("+");
        const newVal = `${split[0]}+${parseInt(split[1]) + bonus}`;
        return this.description.replace(/{VAL}/g, newVal);
      } else {
        return bonus > 0
          ? this.description.replace(/{VAL}/g, `${this.val}+${bonus}`)
          : this.description.replace(/{VAL}/g, this.val);
      }
    }
  }

  public get ID(): string {
    return this.id;
  }

  public get Name(): string {
    return this.name;
  }

  public get ItemType(): ItemType {
    return this.item_type;
  }

  public get Brew(): string {
    return this.brew;
  }

  public get IsUnique(): boolean {
    return this.id === 'unique'
  }
}

export default Tag;