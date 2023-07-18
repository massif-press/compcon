<template>
  <span>
    <cc-tooltip inline simple :content="label">
      <v-btn size="40" variant="plain" icon @click="$emit('open-selector')">
        <v-icon size="small">mdi-circle-edit-outline</v-icon>
      </v-btn>
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
