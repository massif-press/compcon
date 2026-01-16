<template>
  <div v-show="!item || (item && !item.NoSynergies)"
    :class="inline ? 'd-inline-block' : ''">
    <div v-if="alert">
      <div v-for="s in synergies"
        style="position: relative">
        <cc-alert variant="outlined"
          border-color="primary"
          color="text"
          icon="cc:talent"
          :title="s.Origin"
          class="my-1"
          density="compact">
          <p v-html-safe="s.Detail" />
        </cc-alert>
        <div style="position: absolute; right: -5px; bottom: -4px"
          class="fade-select">
          <v-tooltip max-width="300"
            location="top">
            <template #activator="{ props }">
              <v-icon v-bind="props"
                icon="mdi-alert-outline"
                size="16"
                color="warning" />
            </template>
            The rules in these synergy hints are
            <strong class="text-accent"><u>NOT</u></strong>
            automatically enforced by COMP/CON. Please ensure you manually apply any relevant
            effects during gameplay.
          </v-tooltip>
        </div>
      </div>
    </div>
    <div v-else>
      <div v-if="!synergies.length && showNone"
        class="text-center"
        style="opacity: 0.5">
        <i>None</i>
      </div>
      <v-tooltip v-for="s in synergies"
        max-width="350"
        location="top">
        <template #activator="{ props }">
          <v-icon v-bind="props"
            :size="small ? 'small' : large ? 'large' : ''"
            color="accent">
            cc:talent
          </v-icon>
        </template>
        <div class="heading h5"
          v-text="s.Origin" />
        <v-divider />
        <p class="py-2"
          v-html="s.Detail" />
      </v-tooltip>
    </div>
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
    alert: { type: Boolean },
  },
  computed: {
    synergies() {
      return Synergy.Collect(this.location, this.mech as Mech, this.item as any);
    },
  },
};
</script>
