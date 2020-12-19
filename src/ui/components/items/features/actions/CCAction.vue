<template>
  <component
    :is="cType"
    :action="action"
    :no-action="noAction"
    :activations="activations"
    :unusable="unusable"
    :disabled="disabled"
    @use="$emit('use', $event)"
    @undo="$emit('undo')"
  />
</template>

<script lang="ts">
import Vue from 'vue'
import ActionPanel from './_actionPanel.vue'
import ActionPopup from './_actionPopup.vue'
import ActionButton from './_actionButton.vue'

export default Vue.extend({
  name: 'cc-action',
  components: { ActionPanel, ActionPopup, ActionButton },
  props: {
    action: {
      type: Object,
      required: true,
    },
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
  },
  computed: {
    cType() {
      if (this.active) return 'ActionButton'
      return this.panel ? 'ActionPanel' : 'ActionPopup'
    },
  },
})
</script>
