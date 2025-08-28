<template>
  <cc-alert density="compact" :color="action.Color">
    <v-row dense align="center">
      <v-col cols="auto" v-if="!hideIcon">
        <v-icon size="large" :icon="action.Icon" />
      </v-col>
      <v-col cols="auto">
        <span class="heading h3">
          {{ action.Name }}
        </span>
      </v-col>
      <v-col cols="auto" class="ml-auto mr-2">
        <cc-chip size="small">
          {{ action.Activation.toUpperCase() }}
        </cc-chip>
      </v-col>
    </v-row>
    <action-base :action="action" :tier="tier" />
  </cc-alert>
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
    hideIcon: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
};
</script>
