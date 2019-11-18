<template>
  <span>
    <cc-tooltip inline simple :content="label">
      <v-chip
        small
        label
        dark
        :class="{ fadeSelect: !highlight }"
        :color="highlight ? 'warning' : 'pilot'"
        style="margin-bottom: 1px"
        @click="$emit('open-selector')"
      >
        {{ current }}/{{ max }}&nbsp;
        <v-icon>mdi-circle-edit-outline</v-icon>
      </v-chip>
    </cc-tooltip>
  </span>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'section-edit-chip',
  props: {
    highlight: {
      type: Boolean,
      required: true,
    },
    current: {
      type: Number,
      required: true,
    },
    max: {
      type: Number,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
  },
})
</script>
