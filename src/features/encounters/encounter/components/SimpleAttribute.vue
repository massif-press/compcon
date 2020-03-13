<template>
  <v-col>
    <div class="heading h3 text-center">
      {{ attr }}
      <br />
      <b class="accent--text heading h2">{{ val }}</b>
    </div>
  </v-col>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'simple-attribute',
  props: {
    attr: {
      type: [String, Number],
      required: true,
    },
    val: {
      type: [String, Number],
      required: true,
    },
  },
})
</script>
