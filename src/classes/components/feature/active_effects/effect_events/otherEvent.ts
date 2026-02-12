import { EffectOther } from '../effect_subtype/EffectOther'

class OtherEvent {
  public Type: string
  public Value: number | string

  constructor(eo: EffectOther) {
    this.Type = eo.Type
    this.Value = eo.Value
  }

  public ToJSON() {
    return {
      Type: this.Type,
      Value: this.Value,
    }
  }
}

export { OtherEvent }
