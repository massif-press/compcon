<template>
  <cc-titled-panel :title="bonus.Name" :color="bonus.Manufacturer.Color" dense>
    <p class="flavor-text pb-0 mb-2 mt-0" v-html="bonus.Description" />
    <p class="effect-text pa-2 mx-2 my-1 light-panel clipped" v-html="bonus.Effect" />
  </cc-titled-panel>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'cc-core-bonus-item',
  props: {
    bonus: {
      type: Object,
      required: true,
    },
  },
})
</script>
