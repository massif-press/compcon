import { EffectSpecial } from '../effect_subtype/EffectSpecial';

class SpecialEvent {
  public Attribute: string;
  public Detail: string;
  public Duration?: string;

  constructor(es: EffectSpecial) {
    this.Attribute = es.Attribute;
    this.Detail = es.Detail;
    if (es.Duration) this.Duration = es.Duration;
  }
}

export { SpecialEvent };
