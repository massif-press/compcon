<template>
  <cc-tooltip :title="title" :content="content">
    <span>{{ label }}</span>
  </cc-tooltip>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'contributor',
  props: {
    label: String,
    value: [Number, String],
    contributors: Array,
    reverse: Boolean,
  },
  computed: {
    title(): string {
      return this.reverse ? `${this.label} ${this.value}` : `${this.value} ${this.label}`
    },
    content(): string {
      return this.contributors.join('<br />')
    },
  },
})
</script>
