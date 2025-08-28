<template>
  <component
    :is="cType"
    :action="action"
    :no-action="noAction"
    :activations="activations"
    :unusable="unusable"
    :disabled="disabled"
    :tier="tier"
    :hide-icon="hideIcon"
    @use="$emit('use', $event)"
    @undo="$emit('undo')" />
</template>

<script lang="ts">
import ActionPanel from './_actionPanel.vue';
import ActionPopup from './_actionPopup.vue';
import ActionHover from './_actionHover.vue';
import ActionButton from './_actionButton.vue';

export default {
  name: 'cc-action',
  components: { ActionPanel, ActionPopup, ActionHover, ActionButton },
  props: {
    action: {
      type: Object,
      required: true,
    },
    hover: { type: Boolean },
    popup: {
      type: Boolean,
      default: true,
    },
    panel: {
      type: Boolean,
    },
    noAction: {
      type: Boolean,
    },
    active: {
      type: Boolean,
    },
    disabled: {
      type: Boolean,
    },
    unusable: {
      type: Boolean,
    },
    activations: {
      type: Number,
      required: false,
      default: 2,
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
  computed: {
    cType() {
      if (this.active) return ActionButton;
      if (this.hover) return ActionHover;
      return this.panel ? ActionPanel : ActionPopup;
    },
  },
};
</script>
