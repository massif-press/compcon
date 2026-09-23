<template>
  <end-encounter-panel
    :combatants="[sheet.Combatant]"
    :build-stream="() => sheet.Stream"
    :focus-actor-id="sheet.PilotID"
    :confirm-message="$t('active.pcEndEncounter.confirm')"
    @end="end"
  />
</template>

<script setup lang="ts">
  import { useRouter } from 'vue-router'
  import PilotSheet from '@/features/pilot_management/store/PilotSheet'
  import { PilotSheetStore, PilotStore } from '@/stores'
  import EndEncounterPanel from '@/features/active_mode/_components/EndEncounterPanel.vue'
  import logger from '@/user/logger'
  import { commitOutcome } from '@/classes/components/combat/log/outcome'
  import type { IOutcome } from '@/classes/components/combat/log/outcome'
  import { bypassLeaveGuard } from '../../_shared/useRunnerOptions'

  const router = useRouter()

  defineOptions({ name: 'PcEndEncounter' })

  const props = defineProps<{
    sheet: PilotSheet
  }>()

  async function end(result: string, outcomes: Record<string, IOutcome>) {
    const outcome = outcomes[props.sheet.Combatant.id]
    if (outcome) commitOutcome(props.sheet.Combatant, outcome)
    props.sheet.Pilot.CombatController.EndEncounter()
    props.sheet.Pilot.CombatController.Record('encounter.end', {
      result,
      rounds: props.sheet.Round,
    })
    // the player's own record of their own fight, marked `source: 'self'`. A GM log for the same
    // encounter, imported later, replaces it wholesale (D3)
    try {
      await PilotStore().RecordStream(props.sheet.Stream, props.sheet.PilotID, props.sheet.PilotID)
    } catch (err) {
      logger.error('Failed to record encounter log to pilot logbook', props.sheet, err)
    }
    props.sheet.Archive()
    PilotSheetStore().SetActiveSheet('')
    bypassLeaveGuard()
    router.replace('/active-mode/sheet-manager')
  }
</script>
