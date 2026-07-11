import { ItemType } from '../../../enums'
import { DEFAULT_LCP_NAME } from '../../../LcpItemMixin'

class CustomSkill {
  public readonly ItemType: ItemType;
  public readonly Name: string;
  private _description: string;
  private _detail: string;

  public constructor(name: string, description: string, detail: string) {
    this.Name = name;
    this._description = description;
    this._detail = detail;
    this.ItemType = ItemType.Skill;
  }

  public get ID(): string {
    return this.Name.replace(/\s+/g, '-').toLowerCase();
  }

  public get Trigger(): string {
    return this.Name;
  }

  public get Description(): string {
    return this._description;
  }

  public set Description(val: string) {
    this._description = val;
  }

  public get Brew(): string {
    return 'N/A';
  }

  public get Detail(): string {
    return this._detail;
  }

  public set Detail(val: string) {
    this._detail = val;
  }

  public get Family(): string {
    return 'Custom';
  }

  public get Icon(): string {
    return 'cc:skill';
  }

  public get LcpName(): string {
    return DEFAULT_LCP_NAME;
  }
}

export default CustomSkill;
