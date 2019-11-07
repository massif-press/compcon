<template>
  <span>
    <cc-tooltip inline simple :content="label">
      <v-icon
        dark
        class="fadeSelect ml-8 mr-2"
        @click="$emit('open-selector')"
      >mdi-circle-edit-outline</v-icon>
    </cc-tooltip>
  </span>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'section-edit-chip',
  props: {
    label: {
      type: String,
      required: true,
    },
  },
})
</script>