<template>
  <v-col cols="auto">
    <v-card
      variant="outlined"
      class="pa-2"
      width="2.5in"
      height="3.5in"
      color="primary"
      style="position: relative"
    >
      <div class="text-black">
        <slot />
      </div>
    </v-card>
  </v-col>
</template>

<script lang="ts">
export default {
  name: 'print-card',
};
</script>
