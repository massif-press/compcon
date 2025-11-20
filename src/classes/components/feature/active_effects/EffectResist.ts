import { EffectSave } from './EffectSave';

interface IEffectResistData {
  resist?: string;
  vulnerable?: string;
  immunity?: string;
  save?: string | { stat: string; aoe?: boolean };
  aoe?: boolean;
  duration?: string;
  target?: 'self' | 'ally' | 'enemy' | 'any';
}

class EffectResist {
  public readonly ResistType: 'Resistance' | 'Vulnerability' | 'Immunity' = 'Resistance';
  public readonly Resist: string;
  public readonly AoE: boolean;
  public readonly Duration: string;
  public readonly Target: 'self' | 'ally' | 'enemy' | 'any';
  public readonly Save?: EffectSave;

  public constructor(data: IEffectResistData) {
    if (data.vulnerable) {
      this.ResistType = 'Vulnerability';
      this.Resist = data.vulnerable;
    } else if (data.immunity) {
      this.ResistType = 'Immunity';
      this.Resist = data.immunity;
    } else {
      this.ResistType = 'Resistance';
      this.Resist = data.resist || (data as any).resistance || 'all';
    }
    this.AoE = data.aoe || false;
    this.Duration = data.duration || 'End of Encounter';
    this.Target = data.target || 'any';
    if (data.save) this.Save = new EffectSave(data.save);
  }
}

export { EffectResist };
export type { IEffectResistData };
