<template>
  <v-row v-if="statuses.length" class="pa-4">
    <v-col v-for="status in statuses" cols="12" md="">
      <cc-alert :color="status.color" :icon="status.icon" :title="status.title">
        <p v-text="status.text" />
      </cc-alert>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Mech } from '@/class';

export default {
  name: 'status-alerts',
  props: {
    mech: {
      status: Object,
      required: true,
    },
  },
  computed: {
    statuses(): { title: string; text: string; icon: string; color: string }[] {
      const out = [] as { title: string; text: string; icon: string; color: string }[];
      // if ((this.mech as Mech).Destroyed) out.push('destroyed')
      // if ((this.mech as Mech).MechLoadoutController.ActiveLoadout.Systems.filter(x => x.IsCascading).length)
      //   out.push('cascading')
      if ((this.mech as Mech).FreeSP < 0)
        out.push({
          title: 'SYSTEM CAPACITY EXCEEDED',
          text: 'Loadout configuration exceeds available Frame System Capacity',
          icon: 'mdi-alert',
          color: 'error',
        });
      if ((this.mech as Mech).FreeSP > 0)
        out.push({
          title: 'SYSTEM CAPACITY REMAINING',
          text: 'Operational capacity significantly impaired',
          icon: 'mdi-alert-decagram-outline',
          color: 'warning',
        });
      if ((this.mech as Mech).MechLoadoutController.ActiveLoadout.HasEmptyMounts)
        out.push({
          title: 'EMPTY MOUNTS DETECTED',
          text: 'Operational capacity significantly impaired',
          icon: 'mdi-alert-decagram-outline',
          color: 'warning',
        });
      if ((this.mech as Mech).RequiredLicenses.filter((x) => x.missing).length)
        out.push({
          title: 'UNLICENSED EQUIPMENT DETECTED',
          text: 'Pilot is missing one or more licenses required to legally print or operate this configuration',
          icon: 'mdi-alert',
          color: 'warning',
        });
      if (!(this.mech as Mech).HasCompatibleMods())
        out.push({
          title: 'INCOMPATIBLE WEAPON MOD',
          text: 'One or more weapon mods are installed to incompatible weapons',
          icon: 'mdi-cancel',
          color: 'warning',
        });
      return out;
    },
  },
};
</script>
