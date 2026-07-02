<template>
  <end-encounter-panel
    :action-report="actionReport"
    confirm-message="Ending this encounter will close the active sheet instance and send a copy to the archive. Are you sure you want to continue?"
    @end="end" />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import PilotSheet from '@/features/pilot_management/store/PilotSheet';
import { PilotSheetStore } from '@/stores';
import EndEncounterPanel from '@/features/active_mode/_components/EndEncounterPanel.vue';
const router = useRouter()

defineOptions({ name: 'DamageMenu' })

const props = defineProps<{
  sheet: PilotSheet
}>()

const actionReport = ref([] as any[])

function end() {
      props.sheet.Archive();
      PilotSheetStore().SetActiveSheet('');
      router.replace('/active-mode/sheet-manager');
    }

onMounted(() => {
const actor = props.sheet.Pilot.CombatController.RootActor;
    actionReport.value = [{ id: actor.ID, actor }];
})
</script>
