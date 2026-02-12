import { Status } from '@/classes/Status'
import { EffectDurationText, EffectDuration } from '../effect_subtype/EffectDuration'
import { EffectStatus } from '../effect_subtype/EffectStatus'

// status, condition, special, or resist
class StatusEvent {
  public Status: Status
  public Duration?: string

  constructor(es: EffectStatus) {
    this.Status = es.Status
    if (es.Duration) this.Duration = EffectDurationText(es.Duration as EffectDuration)
  }

  public ToJSON() {
    return {
      StatusName: this.Status.Name,
      Duration: this.Duration,
    }
  }
}

export { StatusEvent }
