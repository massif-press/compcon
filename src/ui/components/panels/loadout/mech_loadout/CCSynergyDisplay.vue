<template>
  <div
    v-show="!item || (item && !item.NoSynergies)"
    :class="inline ? 'd-inline-block' : ''"
  >
    <div
      v-if="!synergies.length && showNone"
      class="text-center"
      style="opacity: 0.5"
    >
      <i>None</i>
    </div>
    <cc-tooltip
      v-for="(s, i) in synergies"
      inline
      :title="s.Origin"
      :content="s.Detail"
    >
      <v-icon :small="small" :large="large" color="accent">cc:talent</v-icon>
    </cc-tooltip>
  </div>
</template>

<script lang="ts">
import { Synergy } from '@/class';

export default {
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
    showNone: { type: Boolean },
  },
  computed: {
    synergies() {
      return Synergy.Collect(this.location, this.mech, this.item);
    },
  },
};
</script>
