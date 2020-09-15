<template>
  <component :is="panel ? 'ActionPanel' : 'ActionPopup'" :action="action" />
</template>

<script lang="ts">
import Vue from 'vue'
import ActionPanel from './_actionPanel.vue'
import ActionPopup from './_actionPopup.vue'

export default Vue.extend({
  name: 'cc-action',
  components: { ActionPanel, ActionPopup },
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
  },
})
</script>
