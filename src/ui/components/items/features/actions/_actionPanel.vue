<template>
  <v-alert variant="outlined" density="compact" :color="action.Color">
    <v-row dense align="center">
      <v-col cols="auto">
        <v-icon size="large" color="stark" :icon="action.Icon" />
      </v-col>
      <v-col cols="auto">
        <span class="heading h2 text-text">
          {{ action.Name }}
        </span>
      </v-col>
      <v-col cols="auto" class="ml-auto pl-5">
        <v-chip size="small" label class="text-text">
          {{ action.Activation.toUpperCase() }}
        </v-chip>
      </v-col>
    </v-row>
    <action-base :action="action" :tier="tier" />
  </v-alert>
</template>

<script lang="ts">
import ActionBase from './_actionBase.vue';

export default {
  name: 'action-panel',
  components: { ActionBase },
  props: {
    action: {
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
