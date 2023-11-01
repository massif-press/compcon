<template>
  <div
    v-for="i in rows"
    class="my-1"
    style="height: 20px; width: 100%"
    :style="lined ? 'border-bottom: 1px solid rgba(0,0,0,0.2)' : ''"
  />
</template>

<script lang="ts">
export default {
  name: 'terse-print',
  props: {
    rows: {
      type: Number,
      required: true,
    },
    lined: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
};
</script>
