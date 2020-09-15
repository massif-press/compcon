<template>
  <component :is="panel ? 'integratedInfoPanel' : 'integratedInfoPopup'" :item="item" />
</template>

<script lang="ts">
import Vue from 'vue'
import integratedInfoPanel from './_integratedInfoPanel.vue'
import integratedInfoPopup from './_integratedInfoPopup.vue'

export default Vue.extend({
  name: 'cc-integrated-info',
  components: { integratedInfoPanel, integratedInfoPopup },
  props: {
    item: {
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
