<template>
  <v-alert variant="outlined" density="compact" :color="action.Color">
    <v-row dense align="center">
      <v-col cols="auto">
        <v-icon size="large" color="stark" :icon="action.Icon" />
      </v-col>
      <v-col cols="auto">
        <span :class="`heading ${$vuetify.display.smAndDown ? 'h3' : 'h2'} text-text`">
          {{ action.Name }}
        </span>
      </v-col>
      <v-col cols="auto" class="ml-auto pl-5">
        <v-chip
          v-if="!action.Frequency.Unlimited"
          slot="title-items"
          color="stark"
          :size="$vuetify.display.smAndDown ? 'small' : 'x-small'"
          class="stat-text mr-2"
          variant="outlined"
          label
        >
          {{ action.Frequency.ToString() }}
        </v-chip>
        <v-chip
          :size="$vuetify.display.smAndDown ? 'small' : 'x-small'"
          label
          :color="`action--${action.Activation.toLowerCase()}`"
        >
          {{ action.Activation.toUpperCase() }}
        </v-chip>
      </v-col>
    </v-row>
    <action-base :action="action" />
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
  },
};
</script>
