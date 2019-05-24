import {DamageType} from '@/class'
import colors from '@/features/_shared/UI/CCColors'

//TODO: getDamage(mech?: Mech, mount?: Mount) to collect all relevant bonuses

class Damage {
  private damage_type: DamageType;
  private value: string;
  private override: boolean;

  constructor(damage: {
    type: string;
    val: string | number;
    override: boolean;
  }) {
    this.damage_type = this.getDamageType(damage.type)
    this.value = (typeof damage.val === 'number') ? damage.val.toString() : damage.val;
    this.override = damage.override || false;
  }

  private getDamageType(str: string): DamageType {
    switch (str) {
      case "kinetic": return DamageType.Kinetic;
      case "energy": return DamageType.Energy;
      case "explosive": return DamageType.Explosive;
      case "heat": return DamageType.Heat;
      case "burn": return DamageType.Burn;
    }
    return DamageType.Variable
  }

  public get Override(): boolean {
    return this.override
  }

  public get Type(): DamageType {
    return this.damage_type;
  }

  public get Value(): string {
    return this.value;
  }

  public get Icon(): string {
    return `cc-${this.damage_type.toLowerCase()}`
  }

  public get ToString(): string {
    if (this.override) return this.value;
    return `${this.value} ${this.damage_type} Damage`;
  }

  public Color(dark: boolean): string {
    var c: any = colors;
    var dt = this.damage_type.toLowerCase();
    if (!dt || !c[dt])
      return dark ? "#FFF" : "#000";
    return dark ? c[dt].dark : c[dt].light;
  }
}


export default Damage;