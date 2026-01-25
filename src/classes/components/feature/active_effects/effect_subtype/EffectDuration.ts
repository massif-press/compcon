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
  switch (duration) {
    case EffectDuration.StartTurnSelf:
      return 'Start of Your Turn';
    case EffectDuration.StartTurnTarget:
      return "Start of Target's Turn";
    case EffectDuration.EndTurnSelf:
      return 'End of Your Turn';
    case EffectDuration.EndTurnTarget:
      return "End of Target's Turn";
    case EffectDuration.NextTurnEndSelf:
      return 'End of Your Next Turn';
    case EffectDuration.NextTurnEndTarget:
      return "End of Target's Next Turn";
    case EffectDuration.NextTurnStartSelf:
      return 'Start of Your Next Turn';
    case EffectDuration.NextTurnStartTarget:
      return "Start of Target's Next Turn";
    default:
      return '';
  }
};
