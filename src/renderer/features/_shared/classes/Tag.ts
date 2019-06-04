import { ItemType, Pilot } from '@/class'
import store from '@/store';

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
    this.brew = tagData.brew || "Core";
    this.val = "";
    this.item_type = ItemType.Tag;
  }

  public set Value(val: number | string) {
    this.val = val;
  }

  public Description(add_bonus?: number): string {
    let bonus = 0;
    if (this.ID === 'limited') bonus = add_bonus || 0
    if (!this.val) return this.description;
    if (typeof this.val === "number") {
      return this.description.replace(
        /{VAL}/g,
        (this.val + bonus).toString()
      );
    } else {
      var str = this.val as string;
      console.log(str)
      if (str.includes("+")) {
        const split = str.split("+");
        let newVal = `${split[0]}+${parseInt(split[1]) + bonus}`;
        let newDesc = this.description.replace(/{VAL}/g, newVal);
        return bonus ? `${newDesc} (+${bonus})` : newDesc;
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

  public Name(add_bonus?: number): string {
    let bonus = 0;
    if (this.ID === 'limited') bonus = add_bonus || 0
    if (!this.val) return this.name;
    if (typeof this.val === "number") {
      return this.name.replace(
        /{VAL}/g,
        (this.val + bonus).toString()
      );
    } else {
      var str = this.val as string;
      if (str.includes("+")) {
        const split = str.split("+");
        let newVal = `${split[0]}+${parseInt(split[1]) + bonus}`;
        let newName = this.name.replace(/{VAL}/g, newVal);
        return bonus ? `${newName} (+${bonus})` : newName;
      } else {
        return bonus > 0
          ? this.name.replace(/{VAL}/g, `${this.val}+${bonus}`)
          : this.name.replace(/{VAL}/g, this.val);
      }
    }
  }

  public get ItemType(): ItemType {
    return this.item_type;
  }

  public get Brew(): string {
    return this.brew;
}

  public get IsUnique(): boolean {
    return this.id === "unique";
  }

  public static Deserialize(data: ITagData[]): Tag[] {
    let output = [] as Tag[];
    if (!data) return output;
    data.forEach(x => {
      let t = new Tag(store.getters.getItemById("Tags", x.id));
      if (x.val) t.Value = x.val;
      output.push(t);
    });
    return output;
  }
}

export default Tag;