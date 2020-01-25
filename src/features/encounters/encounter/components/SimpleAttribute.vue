<template>
  <v-col>
    <div class="heading h2 text-left">
      {{ attr }}:
      <b class="primary--text">{{ val }}</b>
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
