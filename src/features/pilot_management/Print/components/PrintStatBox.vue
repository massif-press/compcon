<template>
  <v-col cols="auto"
    :style="`min-height: ${blank ? '60' : '50'}px; min-width: ${minWidth}`">
    <fieldset>
      <legend class="caption font-weight-bold text-primary px-1">{{ label }}</legend>
      <div v-if="!blank && value !== null"
        class="heading h2 text-center mt-n2">{{ value }}</div>
    </fieldset>
  </v-col>
</template>

<script lang="ts">
export default {
  name: 'PrintStatBox',
  props: {
    label: { type: String, required: true },
    value: { type: [String, Number], default: null },
    blank: { type: Boolean, default: false },
    minWidth: { type: String, default: '8vw' },
  },
}
</script>
