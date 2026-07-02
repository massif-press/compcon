<template>
  <end-encounter-panel
    :action-report="props.encounterInstance.Combatants"
    confirm-message="Ending this encounter will close the active instance and send a copy to the archive. Archived encounters can not be resumed (but may be restarted). Are you sure you want to continue?"
    @end="end" />
</template>

<script setup lang="ts">
import type { EncounterInstance } from '@/classes/encounter/EncounterInstance'
import { EncounterStore } from '@/stores';
import EndEncounterPanel from '@/features/active_mode/_components/EndEncounterPanel.vue';

defineOptions({ name: 'DamageMenu' })

const props = defineProps<{
  encounterInstance: EncounterInstance
}>()

async function end(result: string) {
      const report = props.encounterInstance.Combatants.map(c => ({
        name: c.actor.CombatController.CombatName,
        status: c.status,
        pilotStatus: c.pilotStatus,
        mechStatus: c.mechStatus,
      }));
      await EncounterStore().ArchiveEncounterInstance(props.encounterInstance, JSON.stringify(report, null, 2), result);
    }
</script>
