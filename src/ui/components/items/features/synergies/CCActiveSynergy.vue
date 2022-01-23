<template>
  <v-row no-gutters justify="center">
    <v-col v-for="(s, i) in synergies" :key="`syn_${i}`" style="min-width: 33%;">
      <v-alert dense outlined class="py-1 ma-1" color="primary">
        <div class="overline mt-n2 subtle--text">
          ACTIVE SYNERGY
          <cc-slashes />
          <span class="text--text">{{ s.Origin }}</span>
        </div>
        <div v-html-safe="s.Detail" class="body-text text--text" />
      </v-alert>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Synergy } from '@/classes/Synergy'
import Vue from 'vue'
export default Vue.extend({
  name: 'cc-active-synergy',
  props: {
    locations: {
      type: [String, Array],
      required: true,
    },
    item: {
      type: Object,
      required: false,
      default: null,
    },
    mech: {
      type: Object,
      required: true,
    },
  },
  computed: {
    synergies() {
      if (!this.locations) return []
      if (Array.isArray(this.locations))
        return this.locations.flatMap(l => Synergy.Collect(l, this.mech, this.item))
      return Synergy.Collect(this.locations, this.mech, this.item)
    },
  },
})
</script>
