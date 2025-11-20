<template>
  <cc-dialog
    :color="action.Color"
    :icon="action.Icon"
    :title="action.Name"
    :close-on-click="closeOnClick">
    <template #activator="{ open }">
      <cc-button
        size="x-small"
        block
        :color="action.Color"
        :prepend-icon="prependIcon"
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
    hideIcon: {
      type: Boolean,
      required: false,
      default: false,
    },
    closeOnClick: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  computed: {
    prependIcon() {
      if (this.hideIcon) return '';
      return this.action.Icon;
    },
  },
};
</script>
