<template>
  <v-tooltip top content-class="cc-tooltip" :open-delay="delayed ? 500 : 0">
    <template v-slot:activator="{ on }">
      <div :class="{'d-inline': inline}" v-on="on">
        <slot />
      </div>
    </template>
    <span v-if="err">
      Unable to load tooltip information. This may be due to malformed data or an unloaded content
      package.
    </span>
    <div v-else>
      <div v-if="simple">
        <p class="flavor-text white--text" v-html="content" />
      </div>
      <div v-else>
        <span v-if="title" class="heading h3 accent--text">{{ title }}</span>
        <v-divider v-if="title" dark class="my-1" />
        <p class="flavor-text white--text pb-0 mb-0" v-html="content" />
      </div>
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
      default: '',
    },
    simple: {
      type: Boolean,
      required: false,
    },
    inline: {
      type: Boolean,
      required: false,
    },
    delayed: {
      type: Boolean,
      required: false,
    },
    title: {
      type: String,
      required: false,
      default: '',
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
  background: rgba(66, 66, 66, 1) !important;
  background-color: rgba(66, 66, 66, 1) !important;
  opacity: 1 !important;
  max-width: 50vw;
}
</style>
