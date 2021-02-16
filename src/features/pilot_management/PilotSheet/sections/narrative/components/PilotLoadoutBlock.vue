<template>
  <div class="pb-3">
    <cc-title small color="pilot" class="mb-2 pl-5" style="margin-left: -40px!important">
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
