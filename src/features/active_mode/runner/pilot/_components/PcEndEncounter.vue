<template>
  <end-encounter-panel
    :action-report="actionReport"
    :confirm-message="$t('active.pcEndEncounter.confirm')"
    @end="end"
  />
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import PilotSheet from '@/features/pilot_management/store/PilotSheet'
  import { PilotSheetStore, PilotStore } from '@/stores'
  import EndEncounterPanel from '@/features/active_mode/_components/EndEncounterPanel.vue'
  import logger from '@/user/logger'
  import { bypassLeaveGuard } from '../../_shared/useRunnerOptions'

  const router = useRouter()

  defineOptions({ name: 'PcEndEncounter' })

  const props = defineProps<{
    sheet: PilotSheet
  }>()

  const actionReport = ref([] as any[])

  async function end(result: string) {
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

  onMounted(() => {
    const actor = props.sheet.Pilot.CombatController.RootActor
    actionReport.value = [{ id: actor.ID, actor }]
  })
</script>
