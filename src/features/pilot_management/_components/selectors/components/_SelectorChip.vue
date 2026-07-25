<template>
  <v-chip class="ma-1"
    size="small"
    closable
    :model-value="true"
    @update:model-value="() => {}"
    @click:close="$emit('remove')">
    <slot />
    <template #close>
      <v-icon size="small"
        color="error"
        icon="mdi-minus-circle-outline" />
    </template>
  </v-chip>
</template>

<script setup lang="ts">
defineEmits<{ remove: [] }>()
</script>
