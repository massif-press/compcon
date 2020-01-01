<template>
  <cc-titled-panel icon="cci-corebonus" :title="bonus.Name" :color="bonus.Manufacturer.Color">
    <p class="flavor-text" v-html="bonus.Description" />
    <p class="effect-text pb-0" v-html="bonus.Effect" />
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