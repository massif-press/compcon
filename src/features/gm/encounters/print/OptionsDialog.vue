<template>
  <print-options-base
    :options="options"
    :include-groups="includeGroups"
    :extra-options="extraOptions"
  />
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import PrintOptionsBase from '@/shared/print/PrintOptionsBase.vue'
  import { INCLUDE, EXTRA } from '@/ui/print/options'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()

  defineProps<{ options: Record<string, any> }>()

  const includeGroups = computed(() => [
    {
      field: 'include',
      legend: t('common.options'),
      items: [INCLUDE.image, INCLUDE.map, INCLUDE.appendLined, INCLUDE.appendUnlined],
    },
  ])

  const extraOptions = [EXTRA.gmTracker, EXTRA.tagRef, EXTRA.combatRef, EXTRA.actionRef]
</script>
