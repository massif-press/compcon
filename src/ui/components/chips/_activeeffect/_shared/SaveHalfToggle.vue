<template>
  <v-col v-if="hasSave"
    cols="auto"
    class="pl-5 pr-2">
    <div class="text-cc-overline text-disabled">{{ $t('ui.combat.saveHalf') }}</div>
    <div class="mt-2">
      <cc-switch :model-value="saveHalf"
        size="large"
        color="error"
        bg-color="background"
        @update:model-value="$emit('update:save-half', $event)" />
    </div>
  </v-col>
</template>

<script setup lang="ts">
const props = defineProps<{
  saveHalf: boolean
  hasSave: boolean
}>()

const emit = defineEmits<{
  'update:save-half': [...args: any[]]
}>()
</script>
