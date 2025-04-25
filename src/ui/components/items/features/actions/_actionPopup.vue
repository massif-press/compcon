<template>
  <cc-dialog
    :color="action.Color"
    :icon="action.Icon"
    :title="action.Name"
    :sub-title="action.Frequency.ToString()">
    <template #activator="{ open }">
      <cc-button
        size="x-small"
        block
        :color="action.Color"
        :prepend-icon="action.Icon"
        @click="open">
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
