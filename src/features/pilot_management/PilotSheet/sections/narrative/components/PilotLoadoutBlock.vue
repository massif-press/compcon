<template>
  <div class="pb-3">
    <cc-title small color="pilot" class="ml-n10 pl-3 mb-2">
      <span class="ml-9">&emsp;</span>
      Gear Loadout
    </cc-title>
    <cc-pilot-loadout :pilot="pilot" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'pilot-loadout-block',
  props: {
    pilot: {
      type: Object,
      required: true,
    },
  },
})
</script>
