import { EffectResist } from '../effect_subtype/EffectResist'

class ResistEvent {
  public ResistType: string
  public Resist: string

  constructor(er: EffectResist) {
    this.ResistType = er.ResistType
    this.Resist = er.Resist
  }

  public ToJSON() {
    return {
      ResistType: this.ResistType,
      Resist: this.Resist,
    }
  }
}

export { ResistEvent }
