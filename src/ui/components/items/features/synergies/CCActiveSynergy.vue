<template>
  <v-row no-gutters justify="center">
    <v-col v-for="(s, i) in synergies">
      <v-alert density="compact" variant="outlined" class="py-1 ma-1" color="primary">
        <div class="text-overline mt-n2 text-disabled">
          ACTIVE SYNERGY
          <cc-slashes />
          <span class="text-text">{{ s.Origin }}</span>
        </div>
        <div v-html-safe="s.EvaluatedDetail(mech.FeatureController)" class="body-text text-text" />
      </v-alert>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { CompendiumItem, Mech, Synergy } from '@/class';

export default {
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
      if (!this.locations) return [];
      if (Array.isArray(this.locations))
        return this.locations.flatMap((l) =>
          Synergy.Collect(l as string, this.mech as Mech, this.item as CompendiumItem)
        );
      return Synergy.Collect(this.locations, this.mech as Mech, this.item as CompendiumItem);
    },
  },
};
</script>
