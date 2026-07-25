<template>
  <v-menu location="bottom end">
    <template #activator="{ props }">
      <cc-button v-bind="props"
        icon="mdi-dots-vertical"
        size="small"
        :aria-label="$t('common.options')" />
    </template>
    <v-card variant="outlined"
      color="panel">
      <v-list density="compact">
        <v-list-item :title="label || $t('common.reset')"
          prepend-icon="mdi-refresh"
          base-color="error"
          :disabled="disabled"
          @click="$emit('reset')" />
      </v-list>
    </v-card>
  </v-menu>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    disabled?: boolean
    label?: string
  }>(),
  { disabled: false, label: '' }
)

defineEmits<{ reset: [] }>()
</script>
