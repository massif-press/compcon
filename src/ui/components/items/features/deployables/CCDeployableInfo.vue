<template>
  <component :is="panel ? 'deployableInfoPanel' : 'deployableInfoPopup'" :deployable="deployable" />
</template>

<script lang="ts">
import Vue from 'vue'
import deployableInfoPanel from './_deployableInfoPanel.vue'
import deployableInfoPopup from './_deployableInfoPopup.vue'

export default Vue.extend({
  name: 'cc-deployable-info',
  components: { deployableInfoPanel, deployableInfoPopup },
  props: {
    deployable: {
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
