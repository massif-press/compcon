<template>
  <v-row v-if="extended" no-gutters>
    <v-col v-for="(t, i) in tags" :key="`${t.id}_${i}`" cols="12">
      <cc-extended-tag :tag="t" />
    </v-col>
  </v-row>
  <div v-else>
    <cc-tag
      v-for="(t, i) in tags"
      :key="`${t.id}_${i}`"
      :tag="t"
      :small="small"
      :color="color"
      :pilot="pilot"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'cc-tags',
  props: {
    tags: {
      type: Array,
      required: true,
    },
    small: {
      type: Boolean,
      required: false,
    },
    extended: {
      type: Boolean,
      required: false,
    },
    color: {
      type: String,
      required: false,
      default: 'primary',
    },
    pilot: {
      type: Object,
      required: false,
      default: null,
    },
  },
})
</script>
