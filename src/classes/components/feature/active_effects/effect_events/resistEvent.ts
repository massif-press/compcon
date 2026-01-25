import { EffectResist } from '../effect_subtype/EffectResist';

class ResistEvent {
  public ResistType: string;
  public Resist: string;

  constructor(er: EffectResist) {
    this.ResistType = er.ResistType;
    this.Resist = er.Resist;
  }
}

export { ResistEvent };
