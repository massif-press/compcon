<template>
  <v-alert type="error" prominent dense class="destroyed-bg">
    <span class="heading h2 red--text pa-3 ma-5">
      MECH DESTROYED
      <span v-if="mech.ReactorDestroyed" class="heading h2 red--text text--accent-3 pa-0 ma-0">
        <br />
        REACTOR DESTROYED
      </span>
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

<style scoped>
span {
  background-color: black;
}
</style>
