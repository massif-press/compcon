<template>
  <cc-dialog :model-value="modelValue"
    :close-on-click="false"
    title="Exit Active Mode?"
    :z-index="9999"
    @update:model-value="$emit('update:modelValue', $event)">
    <v-card flat
      tile>
      <div class="text-center text-text ma-2">
        {{ $t('active.leaveDialog.prompt') }}</div>
      <v-divider class="my-3" />
      <v-card-actions class="pa-0">
        <cc-button variant="text"
          size="small"
          @click="$emit('cancel')">{{ $t('common.cancel') }}</cc-button>
        <v-spacer />
        <cc-button color="warning"
          size="small"
          variant="text"
          @click="$emit('exit')">{{ $t('active.leaveDialog.exitWithoutSaving') }}</cc-button>
        <v-spacer />
        <cc-button color="accent"
          size="small"
          @click="$emit('save')">{{ $t('active.leaveDialog.saveAndExit') }}</cc-button>
      </v-card-actions>
    </v-card>
  </cc-dialog>
</template>

<script setup lang="ts">
defineProps<{ modelValue: boolean }>()
defineEmits<{
  'update:modelValue': [value: boolean]
  'save': []
  'exit': []
  'cancel': []
}>()
</script>
