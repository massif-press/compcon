<template>
  <v-menu open-on-hover>
    <template #activator="{ props }">
      <v-chip v-bind="props" size="small" color="exotic" class="mx-1"
        ><v-icon start :icon="bonus.Icon" /> {{ bonus.Title }}</v-chip
      >
    </template>
    <v-card>
      <v-toolbar density="compact" color="exotic">
        <v-toolbar-title>
          <v-icon start :icon="bonus.Icon" /> {{ bonus.Title }}
        </v-toolbar-title></v-toolbar
      >
      <bonus-base :bonus="bonus" />
    </v-card>
  </v-menu>
</template>

<script lang="ts">
import bonusBase from './_bonusBase.vue';

export default {
  name: 'bonus-popup',
  components: { bonusBase },
  props: {
    bonus: {
      type: Object,
      required: true,
    },
    tier: {
      type: Number,
      required: false,
    },
  },
};
</script>
