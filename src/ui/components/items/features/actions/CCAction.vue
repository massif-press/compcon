<template>
  <component :is="cType" :action="action" />
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
    active: {
      type: Boolean,
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
