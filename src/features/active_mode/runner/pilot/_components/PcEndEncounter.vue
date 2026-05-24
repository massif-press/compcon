<template>
  <end-encounter-panel
    :action-report="actionReport"
    confirm-message="Ending this encounter will close the active sheet instance and send a copy to the archive. Are you sure you want to continue?"
    @end="end" />
</template>

<script lang="ts">
import PilotSheet from '@/features/pilot_management/store/PilotSheet';
import { PilotStore } from '@/stores';
import EndEncounterPanel from '@/features/active_mode/_components/EndEncounterPanel.vue';

export default {
  name: 'DamageMenu',
  components: { EndEncounterPanel },
  props: {
    sheet: {
      type: PilotSheet,
      required: true,
    },
  },
  data: () => ({
    actionReport: [] as any[],
  }),
  mounted() {
    const actor = this.sheet.Pilot.CombatController.RootActor;
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
    this.actionReport = [out];
  },
  methods: {
    end() {
      this.sheet.Archive();
      PilotStore().SetActiveSheet('');
      this.$router.replace('/active-mode/sheet-manager');
    },
  },
};
</script>
