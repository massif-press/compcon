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
  save?: string | { stat: string; aoe?: boolean };
  aoe?: boolean;
  duration?: string;
  target?: 'self' | 'ally' | 'enemy' | 'any';
}

class EffectOther {
  public readonly Type: OtherCombatEffect;
  public readonly AoE: boolean;
  public readonly Duration: string;
  public readonly Target: 'self' | 'ally' | 'enemy' | 'any';
  public readonly Save?: EffectSave;

  public constructor(data: IEffectOtherData) {
    this.Type = data.type;
    this.AoE = data.aoe || false;
    this.Duration = data.duration || 'End of Encounter';
    this.Target = data.target || 'any';
    if (data.save) this.Save = new EffectSave(data.save);
  }
}

export { EffectOther };
export type { IEffectOtherData };
