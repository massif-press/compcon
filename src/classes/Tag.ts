import { CompendiumItem, ContentPack, ItemType } from '@/class';
import { CompendiumStore } from '@/stores';
import { ActivationType } from './enums';
import { IContentPack, ITagData } from '@/interface';
import logger from '@/user/logger';

export interface ITagCompendiumData {
  id: string;
  name: string;
  description: string;
  filter_ignore?: boolean;
  hidden?: boolean;
}

class Tag {
  public readonly ID: string;
  public readonly FilterIgnore: boolean;
  public readonly IsHidden: boolean;
  public readonly ItemType: ItemType;
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
  public readonly UsageCost: number = 0;
  private _name: string;
  private _val: number | string;
  private _description: string;

  public constructor(tagData: ITagCompendiumData, pack?: ContentPack) {
    this.ID = tagData.id;
    this._name = tagData.name;
    this._description = tagData.description;
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

    if (this.ID === 'tg_full') this.UsageCost = 2;
    else if (this.ID === 'tg_quick') this.UsageCost = 1;

    this.LcpName = pack?.Name || 'Lancer Core Book';
    this.InLcp = !!pack;

    if (!this._val && this._name.includes('{VAL}')) {
      this._val = 1;
    }
  }

  public get Name(): string {
    let out = this._name;
    out = out.replace(/{VAL}/g, 'X');
    const perTier = /(\{.*?\})/gi;
    const matches = out.match(perTier);
    if (matches) {
      matches.forEach((m) => {
        out = out.replace(m, m.replace('{', '<b class="text-accent">').replace('}', '</b>'));
      });
    }
    return out;
  }

  public get Value(): number | string {
    return this._val;
  }

  public set Value(val: number | string) {
    this._val = val;
  }

  public get Description(): string {
    let out = this._description;
    out = out.replace(/{VAL}/g, 'X');
    const perTier = /(\{.*?\})/gi;
    const matches = out.match(perTier);
    if (matches) {
      matches.forEach((m) => {
        out = out.replace(m, m.replace('{', '<b class="text-accent">').replace('}', '</b>'));
      });
    }
    return out;
  }

  public GetDescription(addBonus?: number, tier?: number): string {
    let out = this._description;
    let bonus = 0;
    if (this.ID === 'tg_limited') bonus = addBonus || 0;
    if (this._val) {
      if (typeof this._val === 'number') {
        let r = this._val.toString();
        console.log(r);
        if (bonus)
          r = `${(this._val + bonus).toString()} <span class="caption text--secondary">(Limited ${
            this._val
          } + ${bonus} bonus)</span>`;
        out = this._description.replace(/{VAL}/g, r);
      } else {
        const str = String(this._val);
        if (str.includes('+')) {
          const split = str.split('+');
          const newVal = `${split[0]}+${parseInt(split[1]) + bonus}`;
          const newDesc = this._description.replace(/{VAL}/g, newVal);
          out = bonus ? `${newDesc} (+${bonus})` : newDesc;
        } else {
          out =
            bonus > 0
              ? this._description.replace(/{VAL}/g, `${this._val}+${bonus}`)
              : this._description.replace(/{VAL}/g, this._val);
        }
      }
    }

    const tierPattern = /\{\d+\/\d+\/\d+\}/;
    if (tier) {
      const matches = out.match(tierPattern);
      if (matches) {
        const split = matches[0].replace('{', '').replace('}', '').split('/');
        const val = parseInt(split[tier - 1]);
        out = out.replace(tierPattern, val.toString());
      }
    }

    return out;
  }

  public GetName(addBonus?: number, tier?: number): string {
    let out = this._name;
    let bonus = 0;
    if (this.IsLimited) bonus = addBonus || 0;
    if (this._val) {
      if (typeof this._val === 'number') {
        out = this._name.replace(/{VAL}/g, (this._val + bonus).toString());
      } else {
        const str = String(this._val);
        if (str.includes('+')) {
          const split = str.split('+');
          const newVal = `${split[0]}+${parseInt(split[1]) + bonus}`;
          const newName = this._name.replace(/{VAL}/g, newVal);
          out = bonus ? `${newName} (+${bonus})` : newName;
        } else {
          out =
            bonus > 0
              ? this._name.replace(/{VAL}/g, `${this._val}+${bonus}`)
              : this._name.replace(/{VAL}/g, this._val);
        }
      }
    }

    const tierPattern = /\{\d+\/\d+\/\d+\}/;
    if (tier) {
      const matches = out.match(tierPattern);
      if (matches) {
        const split = matches[0].replace('{', '').replace('}', '').split('/');
        const val = parseInt(split[tier - 1]);
        out = out.replace(tierPattern, val.toString());
      }
    }

    return out;
  }

  public static _genTag(id: string): Tag {
    const t = CompendiumStore().TagData.find((x) => x.id === id);
    if (!t) throw new Error(`Tag ${id} not found`);
    return new Tag(t);
  }

  public static Populate(item: CompendiumItem): Tag[] {
    const tags = [] as Tag[];
    if (item.Deployables) {
      if (item.Deployables.some((x) => x.Type === 'Drone')) tags.push(Tag._genTag('tg_drone'));
      if (item.Deployables.some((x) => x.Type === 'Mine')) tags.push(Tag._genTag('tg_mine'));
      if (item.Deployables.some((x) => x.Type !== 'Drone' && x.Type !== 'Mine'))
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

  public static Serialize(tags: Tag[]): ITagData[] {
    return tags.map((x) => {
      return {
        id: x.ID,
        val: x.Value,
      };
    });
  }

  public static Deserialize(
    data: ITagData[],
    packTags?: ITagCompendiumData[],
    packName?: string
  ): Tag[] {
    const output = [] as Tag[];
    if (!data) return output;
    data.forEach((x) => {
      let t: Tag;

      if (CompendiumStore().TagData.find((t) => t.id === x.id)) t = Tag._genTag(x.id);
      else {
        if (!packTags) throw new Error(`LCP data not provided for tag id: ${x.id}`);
        const pt = packTags.find((t) => t.id === x.id);
        if (!pt) {
          logger.error(
            `Tag ${x.id} not found in pack ${packName} (or has uninstalled dependencies)`,
            this
          );
          return;
        }
        t = new Tag(pt);
      }

      if (x.val) t.Value = x.val;

      output.push(t);
    });
    return output;
  }

  public get Icon(): string {
    return 'mdi-tag-outline';
  }

  // TODO: establish in data
  public get IsCombatTag(): boolean {
    const nonCombatRelevant = [
      'tg_quick',
      'tg_full',
      'tg_free',
      'tg_full',
      'tg_tech_quick',
      'tg_tech_full',
      'tg_protocol',
      'tg_gear',
      'tg_mod',
      'tg_modded',
      'tg_exotic',
      'tg_limited',
      'tg_personal_armor',
      'tg_unique',
      'tg_sidearm',
    ];
    return !nonCombatRelevant.includes(this.ID);
  }
}

export default Tag;
