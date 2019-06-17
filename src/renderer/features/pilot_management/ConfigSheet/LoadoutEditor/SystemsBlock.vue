<template>
  <div>
    <v-card class="mb-2 pr-5 pl-0 pb-4" color="grey darken-2">
      <span class="mount-title pl-3 pr-3 text-uppercase">Systems</span>
      <v-card-text class="bordered ml-3 pt-4 pb-4">
        <mech-system-item
          v-for="(is, i) in mech.IntegratedSystems"
          :key="is + i"
          :maxSP="mech.MaxSP"
          :loadout="loadout"
          :system="is"
          integrated
        />
        <mech-system-item
          v-for="(s, j) in loadout.Systems"
          :key="s.id + j"
          :maxSP="mech.MaxSP"
          :loadout="loadout"
          :system="s"
          :index="j"
        />
        <mech-system-item
          v-if="mech.MaxSP - loadout.TotalSP > 0"
          :loadout="loadout"
          :maxSP="mech.MaxSP"
          empty
        />
      </v-card-text>
      <v-tooltip top v-if="mech.MaxSP - loadout.TotalSP < 0">
        <span
          slot="activator"
          class="bottom-title pl-3 pr-3 red--text font-weight-bold"
        >
          <v-icon color="error">warning</v-icon>
          &emsp;{{ loadout.TotalSP }}/{{ mech.MaxSP }} SP&emsp;
          <v-icon color="error">warning</v-icon>
        </span>
        <span>WARNING: Loadout exceeds system capacity</span>
      </v-tooltip>
      <span v-else class="bottom-title pl-3 pr-3">
        {{ usedSP() }}/{{ mech.MaxSP }} SP
      </span>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import MechSystemItem from './MechSystemItem.vue'
import { MechLoadout, MechSystem, Mech } from '@/class'

export default Vue.extend({
  name: 'systems-block',
  data: () => ({
    systemSelectorModal: false,
  }),
  props: {
    loadout: MechLoadout,
    mech: Mech,
  },
  methods: {
    usedSP(): number {
      return this.mech.MaxSP - this.loadout.TotalSP
    },
  },
  components: { MechSystemItem },
})
</script>
