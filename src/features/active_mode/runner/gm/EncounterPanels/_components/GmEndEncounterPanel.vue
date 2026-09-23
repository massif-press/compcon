<template>
  <end-encounter-panel
    :combatants="props.encounterInstance.Combatants"
    :build-stream="() => props.encounterInstance.Stream"
    :confirm-message="$t('active.endEnc.gmConfirm')"
    @end="end"
  />
</template>

<script setup lang="ts">
  import type { EncounterInstance } from '@/classes/encounter/EncounterInstance'
  import type { IOutcome } from '@/classes/components/combat/log/outcome'
  import { EncounterStore } from '@/stores'
  import EndEncounterPanel from '@/features/active_mode/_components/EndEncounterPanel.vue'
  import { bypassLeaveGuard } from '../../../_shared/useRunnerOptions'

  defineOptions({ name: 'GmEndEncounterPanel' })

  const props = defineProps<{
    encounterInstance: EncounterInstance
  }>()

  async function end(result: string, outcomes: Record<string, IOutcome>) {
    props.encounterInstance.EndEncounter(result, outcomes)
    bypassLeaveGuard()
    await EncounterStore().ArchiveEncounterInstance(props.encounterInstance, '', result)
  }
</script>
