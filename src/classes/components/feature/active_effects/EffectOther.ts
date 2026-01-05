import { EffectSave } from './EffectSave';

enum OtherCombatEffect {
  Overshield = 'overshield',
  Cover = 'cover',
  HP = 'hp',
  Repairs = 'repairs',
  CorePower = 'corepower',
  Heat = 'heat',
  Speed = 'speed',
}

interface IEffectOtherData {
  type: OtherCombatEffect;
  val: number | string;
  save?: string | { stat: string; aoe?: boolean };
  aoe?: boolean;
  duration?: string;
  target?: 'self' | 'ally' | 'enemy' | 'any';
  attack?: 'melee' | 'ranged' | 'tech';
}

class EffectOther {
  public readonly Type: OtherCombatEffect;
  public readonly Value: number | string;
  public readonly AoE: boolean;
  public readonly Duration: string;
  public readonly Target: 'self' | 'ally' | 'enemy' | 'any';
  public readonly Save?: EffectSave;
  public readonly Attack?: 'melee' | 'ranged' | 'tech';

  public constructor(data: IEffectOtherData) {
    this.Type = data.type;
    this.Value = data.val;
    this.AoE = data.aoe || false;
    this.Duration = data.duration || 'End of Encounter';
    this.Target = data.target || 'any';
    if (data.save) this.Save = new EffectSave(data.save);
    if (data.attack) this.Attack = data.attack;
  }
}

export { EffectOther };
export type { IEffectOtherData };
