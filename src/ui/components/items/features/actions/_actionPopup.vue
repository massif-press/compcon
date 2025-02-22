<template>
  <cc-dialog
    :color="action.Color"
    :icon="action.Icon"
    :title="action.Name"
    :sub-title="action.Frequency.ToString()">
    <template #activator="{ open }">
      <cc-button :color="action.Color" @click="open">
        <v-icon start>{{ action.Icon }}</v-icon>
        {{ action.Name }}
      </cc-button>
    </template>
    <action-base :action="action" :tier="tier" />
  </cc-dialog>
</template>

<script lang="ts">
import ActionBase from './_actionBase.vue';

export default {
  name: 'action-popup',
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
