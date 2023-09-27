<template>
  <v-alert
    v-if="license && license.Prerequisite"
    variant="outlined"
    density="compact"
    class="text-center mx-10 mt-2 mb-n1"
    color="warning"
  >
    <div v-if="license.Prerequisite.cumulative">
      This License requires at least
      {{ license.Prerequisite.min_rank }} cumulative Ranks of
      {{ license.Prerequisite.source }} licenses
    </div>
    <div v-else>
      This License requires at least one other
      {{ license.Prerequisite.source }} License at Rank {{ license.Prerequisite.min_rank }} or above
    </div>
  </v-alert>
  <cc-license-panel :license="license" ranked :rank="rank" />

  <v-btn
    v-if="rank < license.Unlocks.length && isSelectable"
    block
    variant="outlined"
    color="secondary"
    @click="$emit('add')"
  >
    <v-icon start>mdi-plus</v-icon>
    Unlock {{ license.Name }} {{ 'I'.repeat(rank + 1) }}
  </v-btn>
  <v-btn v-if="rank" block variant="outlined" color="error" @click="$emit('remove')">
    <v-icon start>cc:difficulty</v-icon>
    Remove {{ license.Name }} {{ 'I'.repeat(rank) }}
  </v-btn>
</template>

<script lang="ts">
import { CompendiumStore } from '@/stores';
import { License } from '@/class';

export default {
  name: 'license-select-item',
  props: {
    license: {
      type: License,
      required: true,
    },
    rank: {
      type: Number,
      required: true,
    },
    isSelectable: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['add', 'remove'],
  methods: {
    frame(id: string) {
      return CompendiumStore().referenceByID('Frames', id);
    },
  },
};
</script>

<style scoped>
#img-hover {
  opacity: 0.7;
  transition: all 0.3s ease-in-out;
}

#hover-parent:hover > #img-hover {
  opacity: 1;
}

.border-primary #img-hover {
  opacity: 1;
}

.pop {
  text-shadow: -1px -1px 0 rgb(var(--v-theme-anti), 1px -1px 0 var(--v-anti)),
    -1px 1px 0 rgb(var(--v-theme-anti), 1px 1px 0 var(--v-anti));
}
</style>
