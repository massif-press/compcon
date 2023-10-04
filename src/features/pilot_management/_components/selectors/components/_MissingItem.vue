<template>
  <v-row>
    <v-col cols="auto">
      <span class="text-disabled">// MISSING DATA //</span>
    </v-col>
    <v-col cols="auto">
      <v-btn icon text color="error" @click="$emit('remove')">
        <v-icon icon="delete" />
      </v-btn>
    </v-col>
  </v-row>
</template>

<script lang="ts">
export default {
  name: 'missing-item',
};
</script>
