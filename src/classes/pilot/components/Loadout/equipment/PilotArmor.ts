import { PilotEquipment, ItemType, Pilot } from '@/class';
import { IBonusDataContainer } from '@/classes/components/feature/bonus/IBonusDataContainer';
import { IContentPack, IPilotEquipmentData, ITagCompendiumData } from '@/interface';
import { Bonus } from '../../../../components/feature/bonus/Bonus';

interface IPilotArmorData extends IPilotEquipmentData {
  hp_bonus?: number;
  speed?: number;
  armor?: number;
  edef?: number;
  edef_bonus?: number;
  evasion?: number;
  evasion_bonus?: number;
}

class PilotArmor extends PilotEquipment {
  public readonly _hpBonus: string;
  public readonly _speed: string;
  public readonly _armor: string;
  public readonly _edef: string;
  public readonly _evasion: string;

  public constructor(data: IPilotArmorData, pack?: ContentPack) {
    super(data, pack);
    this._hpBonus = Bonus.SumStatic(data as IBonusDataContainer, 'pilot_hp');
    this._speed = Bonus.SumStatic(data as IBonusDataContainer, 'pilot_speed');
    this._armor = Bonus.SumStatic(data as IBonusDataContainer, 'pilot_armor');
    this._edef = Bonus.SumStatic(data as IBonusDataContainer, 'pilot_edef');
    this._evasion = Bonus.SumStatic(data as IBonusDataContainer, 'pilot_evasion');
    this.ItemType = ItemType.PilotArmor;
  }

  public get ArmorString() {
    return this.cleanAttrValue(this.Bonuses.find((b) => b.ID === 'pilot_armor'));
  }

  public Armor(pilot: Pilot) {
    const b = this.Bonuses.find((x) => x.ID === 'pilot_armor');
    if (!b) return 0;
    return Bonus.Evaluate(b, pilot);
  }

  public get HpString() {
    return this.cleanAttrValue(this.Bonuses.find((b) => b.ID === 'pilot_hp'));
  }

  public HPBonus(pilot: Pilot) {
    const b = this.Bonuses.find((x) => x.ID === 'pilot_hp');
    if (!b) return 0;
    return Bonus.Evaluate(b, pilot);
  }

  public get EdefString() {
    return this.cleanAttrValue(this.Bonuses.find((b) => b.ID === 'pilot_edef'));
  }

  public EDefense(pilot: Pilot) {
    const b = this.Bonuses.find((x) => x.ID === 'pilot_edef');
    if (!b) return 0;
    return Bonus.Evaluate(b, pilot);
  }

  public get EvasionString() {
    return this.cleanAttrValue(this.Bonuses.find((b) => b.ID === 'pilot_evasion'));
  }

  public Evasion(pilot: Pilot) {
    const b = this.Bonuses.find((x) => x.ID === 'pilot_evasion');
    if (!b) return 0;
    return Bonus.Evaluate(b, pilot);
  }

  public get SpeedString() {
    return this.cleanAttrValue(this.Bonuses.find((b) => b.ID === 'pilot_speed'));
  }

  public Speed(pilot: Pilot) {
    const b = this.Bonuses.find((x) => x.ID === 'pilot_speed');
    if (!b) return 0;
    return Bonus.Evaluate(b, pilot);
  }

  private cleanAttrValue(attr?: Bonus) {
    const e = attr ? attr.Value : 0;
    if (typeof e === 'string') {
      return e.replace(/\{|\}/g, '');
    }
    return e;
  }

  public get Icon(): string {
    return 'cc:pilot';
  }

  // for scatter and comparators
  public get StatsByProfile() {
    return {
      Name: this.Name,
      Source: '',
      LcpName: this.LcpName,
      ID: this.ID,
      Stats: this.Stats,
    };
  }

  public get Stats() {
    return {
      armor: Number(this.ArmorString),
      hp: Number(this.HpString),
      edef: Number(this.EdefString),
      evasion: Number(this.EvasionString),
      speed: Number(this.SpeedString),
    };
  }
}

export { PilotArmor };
export type { IPilotArmorData };
