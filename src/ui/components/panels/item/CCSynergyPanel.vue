<template>
  <cc-tooltip
    title="VANGUARD I: HANDSHAKE ETIQUETTE"
    content="<p class='body-text mb-1 white--text'>+1 Accuracy if target is within Range 3</p>"
  >
    <span>
      <v-icon color="accent">cci-rank-1</v-icon>
    </span>
  </cc-tooltip>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'cc-synergy-panel',
  props: {
    location: { type: String, required: true },
    item: { type: Object, required: true },
    pilot: { type: Object, required: true },
  },
})
</script>
