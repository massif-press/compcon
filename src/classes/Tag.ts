import { CompendiumItem, ItemType } from '@/class';
import { CompendiumStore } from '@/stores';
import { ActivationType } from './enums';

export interface ITagCompendiumData {
  id: string;
  name: string;
  description: string;
  filter_ignore?: boolean;
  hidden?: boolean;
  brew?: string;
}

class Tag {
  public readonly ID: string;
  public readonly FilterIgnore: boolean;
  public readonly IsHidden: boolean;
  public readonly ItemType: ItemType;
  public readonly Brew: string;
  public readonly IsUnique: boolean;
  public readonly IsAI: boolean;
  public readonly NoCascade: boolean;
  public readonly IsExotic: boolean;
  public readonly IsLimited: boolean;
  public readonly IsLoading: boolean;
  public readonly IsRecharging: boolean;
  public readonly IsIndestructible: boolean;
  public readonly IsSmart: boolean;
  public readonly IsHeatCost: boolean;
  public readonly IsOverkill: boolean;
  public readonly LcpName: string = '';
  public readonly InLcp: boolean = false;
  private _name: string;
  private _val: number | string;
  private _description: string;

  public constructor(tagData: ITagCompendiumData, packName?: string) {
    this.ID = tagData.id;
    this._name = tagData.name;
    this._description = tagData.description;
    this.Brew = tagData.brew || 'Core';
    this._val = '';
    this.IsHidden = tagData.hidden || false;
    this.FilterIgnore = tagData.filter_ignore || this.IsHidden;
    this.ItemType = ItemType.Tag;
    this.IsUnique = this.ID === 'tg_unique';
    this.IsAI = this.ID === 'tg_ai';
    this.NoCascade = this.ID === 'tg_no_cascade';
    this.IsLimited = this.ID === 'tg_limited';
    this.IsLoading = this.ID === 'tg_loading';
    this.IsRecharging = this.ID === 'tg_recharge';
    this.IsIndestructible = this.ID === 'tg_indestructible';
    this.IsSmart = this.ID === 'tg_smart';
    this.IsHeatCost = this.ID === 'tg_heat_self';
    this.IsOverkill = this.ID === 'tg_overkill';
    this.IsExotic = this.ID === 'tg_exotic';

    this.LcpName = packName || 'LANCER Core Book';
    this.InLcp = packName ? true : false;
  }

  public get Name(): string {
    return this._name.replace(/{VAL}/g, 'X');
  }

  public get Value(): number | string {
    return this._val;
  }

  public set Value(val: number | string) {
    this._val = val;
  }

  public get Description(): string {
    return this._description.replace(/{VAL}/g, 'X');
  }

  public GetDescription(addBonus?: number): string {
    let bonus = 0;
    if (this.ID === 'tg_limited') bonus = addBonus || 0;
    if (!this._val) return this._description;
    if (typeof this._val === 'number') {
      let r = this._val.toString();
      if (bonus)
        r = `${(this._val + bonus).toString()} <span class="caption text--secondary">(Limited ${
          this._val
        } + ${bonus} bonus)</span>`;
      return this._description.replace(/{VAL}/g, r);
    } else {
      const str = String(this._val);
      if (str.includes('+')) {
        const split = str.split('+');
        const newVal = `${split[0]}+${parseInt(split[1]) + bonus}`;
        const newDesc = this._description.replace(/{VAL}/g, newVal);
        return bonus ? `${newDesc} (+${bonus})` : newDesc;
      } else {
        return bonus > 0
          ? this._description.replace(/{VAL}/g, `${this._val}+${bonus}`)
          : this._description.replace(/{VAL}/g, this._val);
      }
    }
  }

  public GetName(addBonus?: number): string {
    let bonus = 0;
    if (this.IsLimited) bonus = addBonus || 0;
    if (!this._val) return this._name;
    if (typeof this._val === 'number') {
      return this._name.replace(/{VAL}/g, (this._val + bonus).toString());
    } else {
      const str = String(this._val);
      if (str.includes('+')) {
        const split = str.split('+');
        const newVal = `${split[0]}+${parseInt(split[1]) + bonus}`;
        const newName = this._name.replace(/{VAL}/g, newVal);
        return bonus ? `${newName} (+${bonus})` : newName;
      } else {
        return bonus > 0
          ? this._name.replace(/{VAL}/g, `${this._val}+${bonus}`)
          : this._name.replace(/{VAL}/g, this._val);
      }
    }
  }

  public static _genTag(id: string): Tag {
    const t = CompendiumStore().TagData.find((x) => x.id === id);
    if (!t) throw new Error(`Tag ${id} not found`);
    return new Tag(t);
  }

  public static Populate(item: CompendiumItem): Tag[] {
    const tags = [] as Tag[];
    if (item.Deployables) {
      if (item.Deployables.some((x) => x.type === 'Drone')) tags.push(Tag._genTag('tg_drone'));
      if (item.Deployables.some((x) => x.type === 'Mine')) tags.push(Tag._genTag('tg_mine'));
      if (item.Deployables.some((x) => x.type !== 'Drone' && x.type !== 'Mine'))
        tags.push(Tag._genTag('tg_deployable'));
    }
    if (item.Actions) {
      if (item.Actions.some((x) => x.Activation === ActivationType.Protocol))
        tags.push(Tag._genTag('tg_protocol'));
      if (item.Actions.some((x) => x.Activation === ActivationType.Quick))
        tags.push(Tag._genTag('tg_quick_action'));
      if (item.Actions.some((x) => x.Activation === ActivationType.QuickTech))
        tags.push(Tag._genTag('tg_quick_tech'));
      if (item.Actions.some((x) => x.Activation === ActivationType.Full))
        tags.push(Tag._genTag('tg_full_action'));
      if (item.Actions.some((x) => x.Activation === ActivationType.FullTech))
        tags.push(Tag._genTag('tg_full_tech'));
      if (item.Actions.some((x) => x.Activation === ActivationType.Reaction))
        tags.push(Tag._genTag('tg_reaction'));
      if (item.Actions.some((x) => x.Activation === ActivationType.Free))
        tags.push(Tag._genTag('tg_free_action'));
      if (item.Actions.some((x) => x.Activation === ActivationType.Invade))
        tags.push(Tag._genTag('tg_invade'));
    }
    return tags;
  }

  public static Deserialize(data: ITagData[], packTags?: ITagCompendiumData[]): Tag[] {
    const output = [] as Tag[];
    if (!data) return output;
    data.forEach((x) => {
      let t: Tag;

      if (CompendiumStore().TagData.find((t) => t.id === x.id)) t = Tag._genTag(x.id);
      else {
        if (!packTags) throw new Error(`LCP data not provided for tag id: ${x.id}`);
        const pt = packTags.find((t) => t.id === x.id);
        if (!pt) throw new Error(`Tag ${x.id} not found in pack`);
        t = new Tag(pt);
      }

      if (x.val) t.Value = x.val;
      output.push(t);
    });
    return output;
  }
}

export default Tag;
