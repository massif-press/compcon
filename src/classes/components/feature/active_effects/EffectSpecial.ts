import { EffectSave } from './EffectSave';

interface IEffectSpecialData {
  attribute: string;
  detail: string;
  save?: string | { stat: string; aoe?: boolean };
  aoe?: boolean;
  duration?: string;
  target?: 'self' | 'ally' | 'enemy' | 'any';
}

class EffectSpecial {
  public ID: string;
  public readonly Attribute: string;
  public readonly Detail: string;
  public readonly AoE: boolean;
  public readonly Duration: string;
  public readonly Target: 'self' | 'ally' | 'enemy' | 'any';
  public readonly Save?: EffectSave;

  public constructor(data: IEffectSpecialData) {
    this.ID = `effect_special_${Math.random().toString(36).substring(2, 15)}`;
    this.Attribute = data.attribute;
    this.Detail = data.detail;
    this.AoE = data.aoe || false;
    this.Duration = data.duration || 'End of Encounter';
    this.Target = data.target || 'any';
    if (data.save) this.Save = new EffectSave(data.save);
  }
}

export { EffectSpecial };
export type { IEffectSpecialData };
