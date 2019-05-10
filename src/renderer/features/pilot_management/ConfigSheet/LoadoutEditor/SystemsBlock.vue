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
  </div>
</template>

<script>
import MechSystemItem from './MechSystemItem'

export default {
  name: 'systems-block',
  props: {
    systems: Array,
    integrated: Array,
    max_sp: Number,
    free_sp: Number
  },
  components: { MechSystemItem },
  methods: {
    clicked: function (index) {
      this.$emit('clicked', index)
    },
    item: function (id) {
      return this.$store.getters['getItemById']('MechSystems', id)
    }
  }
}
</script>