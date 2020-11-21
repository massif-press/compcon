<template>
  <div :class="inline ? 'd-inline-block' : ''">
    <cc-tooltip
      v-for="(s, i) in synergies"
      :key="`${item ? item.ID : location}_synergy_${i}`"
      inline
      :title="s.Origin"
      :content="s.Detail"
    >
      <v-icon :small="small" :large="large" color="accent">
        cci-talent
      </v-icon>
    </cc-tooltip>
  </div>
</template>

<script lang="ts">
import { Synergy } from '@/class'
import activePilot from '@/features/pilot_management/mixins/activePilot'
import vueMixins from '@/util/vueMixins'

export default vueMixins(activePilot).extend({
  name: 'cc-synergy-display',
  props: {
    item: {
      type: Object,
      required: false,
    },
    mech: {
      type: Object,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    large: { type: Boolean },
    small: { type: Boolean },
    inline: { type: Boolean },
  },
  computed: {
    synergies() {
      return Synergy.Collect(this.location, this.mech, this.item)
    },
  },
})
</script>
