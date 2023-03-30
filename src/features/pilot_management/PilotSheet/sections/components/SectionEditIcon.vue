<template>
  <span>
    <cc-tooltip inline simple :content="label">
      <v-icon
        dark
        class="fade-select ml-8 mr-2"
        @click="$emit('open-selector')"
      >
        mdi-circle-edit-outline
      </v-icon>
    </cc-tooltip>
  </span>
</template>

<script lang="ts">
export default {
  name: 'section-edit-chip',
  props: {
    label: {
      type: String,
      required: true,
    },
  },
};
</script>
