<template>
  <v-tooltip :text="label" location="top">
    <template #activator="{ props }">
      <v-btn
        v-bind="props"
        size="x-small"
        variant="plain"
        class="my-n1"
        icon
        @click="$emit('open-selector')">
        <v-icon size="20" icon="mdi-circle-edit-outline" />
      </v-btn>
    </template>
  </v-tooltip>
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
