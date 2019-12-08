<template>
  <v-alert type="error" prominent dense class="destroyed-bg">
    <span class="heading h2 white--text">
      <span v-if="mech.ReactorDestroyed">
        REACTOR DESTROYED
        <br />
        <div class="overline mt-n2 pl-2">irreparable damage</div>
      </span>
      <span v-else>MECH DESTROYED</span>
    </span>
  </v-alert>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'destroyed-alert',
  props: {
    mech: {
      type: Object,
      required: true,
    },
  },
})
</script>
