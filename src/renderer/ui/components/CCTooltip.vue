<template>
  <v-tooltip top content-class="cc-tooltip">
    <template v-slot:activator="{ on }">
      <div v-on="on">
        <slot></slot>
      </div>
    </template>
    <span
      v-if="err"
    >Unable to load tooltip information. This may be due to malformed data or an unloaded content package.</span>
    <div v-else>
      <span class="heading h3 accent--text">{{title}}</span>
      <v-divider dark class="my-1" />
      <p class="flavor-text white--text">{{ content }}</p>
    </div>
  </v-tooltip>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'cc-tooltip',
  props: {
    err: {
      type: String,
      required: false,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
})
</script>

<style scoped>
.cc-tooltip {
  background: rgba(0, 0, 0, 1) !important;
  background-color: rgba(0, 0, 0, 1) !important;
  opacity: 1 !important;
  max-width: 50vw;
}
</style>