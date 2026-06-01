<template>
  <end-encounter-panel
    :action-report="actionReport"
    confirm-message="Ending this encounter will close the active instance and send a copy to the archive. Archived encounters can not be resumed (but may be restarted). Are you sure you want to continue?"
    @end="end" />
</template>

<script setup lang="ts">
import type { EncounterInstance } from '@/classes/encounter/EncounterInstance'
import { ref, onMounted } from 'vue'
import { EncounterStore } from '@/stores';
import EndEncounterPanel from '@/features/active_mode/_components/EndEncounterPanel.vue';

defineOptions({ name: 'DamageMenu' })

const props = defineProps<{
  encounterInstance: EncounterInstance
}>()

const actionReport = ref([] as any[])

async function end(result: string) {
      await EncounterStore().ArchiveEncounterInstance(props.encounterInstance, JSON.stringify(actionReport.value, null, 2), result);
    }

onMounted(() => {
const report = [] as any[];
    for (const c of props.encounterInstance.Combatants) {
      const actor = c.actor.CombatController.RootActor;
      const out = {
        id: actor.ID,
        name: actor.CombatController.CombatName,
      } as any;
      if (actor.ItemType !== 'Pilot') {
        out.status = actor.CombatController.IsDestroyed ? 'DESTROYED' : 'OPERATIONAL';
      } else {
        out.pilotStatus = 'COMBAT EFFECTIVE';
        if (actor.IsDead) out.pilotStatus = 'KIA';
        if (actor.CombatController.StatController.CurrentStats['hp'] !== actor.CombatController.StatController.MaxStats['hp']) out.pilotStatus = 'INJURED';
        const mech = actor.ActiveMech;
        out.mechStatus = 'MECH OPERATIONAL';
        if (mech.CombatController.AIControl && mech.CombatController.InCascade) out.mechStatus = 'AI CONTROL - IN CASCADE';
        if (mech.CombatController.IsDestroyed) out.mechStatus = 'MECH DESTROYED';
        if (mech.CombatController.ReactorDestroyed) out.mechStatus = 'MECH DESTROYED - REACTOR MELTDOWN';
      }
      report.push(out);
    }
    actionReport.value = report;
})
</script>
