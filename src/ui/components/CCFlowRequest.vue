<template>
  <div v-if="request && request.kind !== 'stage'">
    <div class="text-cc-overline text-disabled">{{ $t(`ui.flow.request.${request.label}`) }}</div>

    <div v-if="request.kind === 'check' && request.pending?.length"
      class="body-text">
      {{ $t('ui.flow.unresolved', { list: request.pending.join(', ') }) }}
    </div>

    <v-select v-else-if="request.kind === 'select'"
      :model-value="modelValue"
      :items="request.options ?? []"
      item-title="label"
      item-value="id"
      :placeholder="$t('active.structureCheck.chooseOne')"
      density="compact"
      variant="outlined"
      hide-details
      @update:model-value="emit('update:modelValue', $event)" />
  </div>
</template>

<script setup lang="ts">
  import type { IFlowRequest } from '@/classes/components/combat/flows/Flow'

  defineProps<{
    request?: IFlowRequest
    modelValue?: string
  }>()

  const emit = defineEmits<{
    'update:modelValue': [value: string]
  }>()
</script>
