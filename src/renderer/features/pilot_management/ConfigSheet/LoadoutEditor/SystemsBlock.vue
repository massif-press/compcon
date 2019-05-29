<template>
  <div>
    <v-card class="mb-2 pr-5 pl-0 pb-4" color="grey darken-2">
      <span class="mount-title pl-3 pr-3 text-uppercase">Systems</span>
      <v-card-text class="bordered ml-3 pt-4 pb-4">
          <mech-system-item v-for="(is, i) in integrated" :key="is + i" :system="item(is)" /> 
          <mech-system-item v-for="(s, j) in systems" :key="s.id + j" :system="s" @clicked="clicked(j)"/> 
          <mech-system-item v-if="free_sp > 0" empty @clicked="clicked(systems.length)"/> 
      </v-card-text>
      <v-tooltip top v-if="free_sp < 0">
      <span slot="activator" class="bottom-title pl-3 pr-3 red--text font-weight-bold">
        <v-icon color="error">warning</v-icon>&emsp;{{free_sp}}/{{max_sp}} SP&emsp;<v-icon color="error">warning</v-icon>
      </span>
      <span>WARNING: Loadout exceeds system capacity</span>
      </v-tooltip>
      <span v-else class="bottom-title pl-3 pr-3">{{free_sp}}/{{max_sp}} SP</span>
    </v-card>

    <!-- System Selector Modal -->
    <v-dialog v-model="systemSelectorModal" lazy fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-toolbar fixed dense flat dark>
        <v-toolbar-title><span class="text-capitalize">Select System</span></v-toolbar-title>
        <v-spacer />
        <v-toolbar-items>
          <v-btn icon large @click="systemSelectorModal = false"> <v-icon large>close</v-icon> </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <system-table :installed_systems="loadout.systems" :free_sp="stats.sp - stats.used_sp" 
        :current_equip="equippedSystem(loadout, itemIndex)" :loadout_index="lIndex" 
        @select-item="equipSystem" @remove-item="removeSystem"/>
    </v-dialog>  
  </div>
</template>

<script>
import MechSystemItem from './MechSystemItem'
import { MechLoadout } from '@/class';
import SystemTable from "./SystemTable.vue";

export default {
  name: 'systems-block',
  props: {
    loadout: MechLoadout,
    systemSelectorModal: false,
  },
  components: { MechSystemItem, SystemTable }
}
</script>