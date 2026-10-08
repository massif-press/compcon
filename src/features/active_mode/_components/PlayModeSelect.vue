<template>
  <div>
    <div
      v-if="!hideLabel"
      class="text-cc-overline text-disabled"
    >
      {{ $t('active.playMode.label') }}
    </div>
    <cc-select
      :model-value="modelValue"
      :items="items"
      item-title="title"
      item-value="value"
      color="primary"
      @update:model-value="$emit('update:modelValue', $event)"
    />
    <div class="text-caption text-disabled">{{ description }}</div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import type { PlayMode } from '@/classes/encounter/EncounterInstance'

  defineOptions({ name: 'PlayModeSelect' })

  const props = defineProps<{ modelValue: PlayMode; hideLabel?: boolean }>()
  defineEmits<{ 'update:modelValue': [value: PlayMode] }>()
  const { t } = useI18n()

  const items = computed(() => [
    { value: 'full', title: t('active.playMode.full') },
    { value: 'simple', title: t('active.playMode.simple') },
  ])
  const description = computed(() =>
    props.modelValue === 'simple'
      ? t('active.playMode.simpleDescription')
      : t('active.playMode.fullDescription')
  )
</script>
