<template>
  <div v-show="!item || (item && !item.NoSynergies)"
    :class="inline ? 'd-inline-block' : ''">
    <div v-if="alert">
      <div v-for="(s, index) in synergies"
        :key="`synergy-${index}`"
        style="position: relative">
        <cc-alert variant="outlined"
          border-color="primary"
          color="text"
          icon="cc:talent"
          class="my-1"
          density="compact">
          <p v-html-safe="s.Detail" />
        </cc-alert>
        <div style="position: absolute; right: -5px; bottom: -4px"
          class="fade-select">
          <cc-tooltip max-width="300"
            icon="mdi-alert-outline"
            size="16"
            color="warning"
            location="top">
            The rules in these synergy hints are
            <strong class="text-accent"><u>NOT</u></strong>
            automatically enforced by COMP/CON. Please ensure you manually apply any relevant
            effects during gameplay.
          </cc-tooltip>
        </div>
      </div>
    </div>
    <div v-else>
      <div v-if="!synergies.length && showNone"
        class="text-center"
        style="opacity: 0.5">
        <i>None</i>
      </div>
      <cc-tooltip v-for="(s, index) in synergies"
        :key="`synergy-${index}`"
        max-width="350"
        location="top"
        :size="small ? 'small' : large ? 'large' : ''"
        color="accent"
        icon="cc:talent">
        <div class="heading h5"
          v-text="s.Origin" />
        <v-divider />
        <p v-html-safe="s.Detail"
          class="py-2" />
      </cc-tooltip>
    </div>
  </div>
</template>

<script lang="ts">
import { Mech } from '@/classes/mech/Mech'
import { Synergy } from '@/classes/components/feature/synergy/Synergy'
import { useMobile } from '@/composables/useMobile';


export default {
  name: 'CcSynergyDisplay',
  mixins: [useMobile],
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
