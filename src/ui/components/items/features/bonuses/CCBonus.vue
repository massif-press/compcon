<template>
  <component :is="panel ? 'bonusPanel' : 'bonusPopup'" :bonus="bonus" />
</template>

<script lang="ts">
import Vue from 'vue'
import bonusPanel from './_bonusPanel.vue'
import bonusPopup from './_bonusPopup.vue'

export default Vue.extend({
  name: 'cc-bonus',
  components: { bonusPanel, bonusPopup },
  props: {
    bonus: {
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
