<template>
  <div v-show="!item || (item && !item.NoSynergies)" :class="inline ? 'd-inline-block' : ''">
    <div v-if="!synergies.length && showNone" class="text-center" style="opacity: 0.5">
      <i>None</i>
    </div>
    <v-tooltip v-for="s in synergies" max-width="350" location="top">
      <template #activator="{ props }">
        <v-icon v-bind="props" :size="small ? 'small' : large ? 'large' : ''" color="accent">
          cc:talent
        </v-icon>
      </template>
      <div class="heading h5" v-text="s.Origin" />
      <v-divider />
      <p class="py-2" v-html="s.Detail" />
    </v-tooltip>
  </div>
</template>

<script lang="ts">
import { Mech, Synergy } from '@/class';

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
      return Synergy.Collect(this.location, this.mech as Mech, this.item as any);
    },
  },
};
</script>
