import { ActiveEffect, IActiveEffectData } from './ActiveEffect'

interface IActiveEffectCallbackData {
  on_miss?: string | IActiveEffectData
  on_attack?: string | IActiveEffectData
  on_hit?: string | IActiveEffectData
  on_crit?: string | IActiveEffectData
}

interface IActiveEffectCallbackTarget {
  OnMiss?: ActiveEffect
  OnAttack?: ActiveEffect
  OnHit?: ActiveEffect
  OnCrit?: ActiveEffect
}

export function initActiveEffectCallbacks(
  data: IActiveEffectCallbackData,
  target: IActiveEffectCallbackTarget,
  owner: any
): void {
  if (data.on_miss) {
    if (typeof data.on_miss === 'string')
      target.OnMiss = new ActiveEffect({ name: 'On Miss Effect', detail: data.on_miss }, owner)
    else target.OnMiss = new ActiveEffect(data.on_miss, owner)
  }
  if (data.on_attack) {
    if (typeof data.on_attack === 'string')
      target.OnAttack = new ActiveEffect({ name: 'On Attack Effect', detail: data.on_attack }, owner)
    else target.OnAttack = new ActiveEffect(data.on_attack, owner)
  }
  if (data.on_hit) {
    if (typeof data.on_hit === 'string')
      target.OnHit = new ActiveEffect({ name: 'On Hit Effect', detail: data.on_hit }, owner)
    else target.OnHit = new ActiveEffect(data.on_hit, owner)
  }
  if (data.on_crit) {
    if (typeof data.on_crit === 'string')
      target.OnCrit = new ActiveEffect({ name: 'On Crit Effect', detail: data.on_crit }, owner)
    else target.OnCrit = new ActiveEffect(data.on_crit, owner)
  }
}
