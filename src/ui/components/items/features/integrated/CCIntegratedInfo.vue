<template>
  <component
    :is="hover ? 'integratedInfoHover' : panel ? 'integratedInfoPanel' : 'integratedInfoPopup'"
    :item="item"
  />
</template>

<script lang="ts">
import Vue from 'vue'
import integratedInfoHover from './_integratedInfoHover.vue'
import integratedInfoPanel from './_integratedInfoPanel.vue'
import integratedInfoPopup from './_integratedInfoPopup.vue'

export default Vue.extend({
  name: 'cc-integrated-info',
  components: { integratedInfoHover, integratedInfoPanel, integratedInfoPopup },
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
    hover: {
      type: Boolean,
    },
  },
})
</script>
