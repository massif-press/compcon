import { ActiveEffect, IActiveEffectData } from './ActiveEffect'
import { keyPrefixes } from '@/i18n/contentKeys'

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

const mkEffect = (
  key: string,
  raw: string | IActiveEffectData | undefined,
  name: string,
  owner: any
): ActiveEffect | undefined => {
  if (!raw) return undefined
  const data = typeof raw === 'string' ? { name, detail: raw } : raw
  keyPrefixes.set(data as object, `${owner.ID}.${key}`)
  return new ActiveEffect(data, owner, undefined, name)
}

export function initActiveEffectCallbacks(
  data: IActiveEffectCallbackData,
  target: IActiveEffectCallbackTarget,
  owner: any
): void {
  target.OnMiss = mkEffect('on_miss', data.on_miss, 'On Miss Effect', owner)
  target.OnAttack = mkEffect('on_attack', data.on_attack, 'On Attack Effect', owner)
  target.OnHit = mkEffect('on_hit', data.on_hit, 'On Hit Effect', owner)
  target.OnCrit = mkEffect('on_crit', data.on_crit, 'On Crit Effect', owner)
}
