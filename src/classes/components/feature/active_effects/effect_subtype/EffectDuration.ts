import { i18n } from '@/i18n'

export enum EffectDuration {
  StartTurnSelf = 'start_turn_self',
  StartTurnTarget = 'start_turn_target',
  EndTurnSelf = 'end_turn_self',
  EndTurnTarget = 'end_turn_target',
  NextTurnEndSelf = 'next_turn_end_self',
  NextTurnEndTarget = 'next_turn_end_target',
  NextTurnStartSelf = 'next_turn_start_self',
  NextTurnStartTarget = 'next_turn_start_target',
}

export const EffectDurationText = function (duration: EffectDuration): string {
  const key = `enums.effectDuration.${duration}`
  return i18n.global.t(i18n.global.te(key, 'en') ? key : 'enums.effectDuration.end_of_encounter')
}
