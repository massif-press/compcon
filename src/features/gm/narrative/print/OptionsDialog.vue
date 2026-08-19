<template>
  <print-options-base
    :options="options"
    :include-groups="includeGroups"
  />
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import PrintOptionsBase from '@/shared/print/PrintOptionsBase.vue'
  import { INCLUDE } from '@/ui/print/options'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()

  defineProps<{ options: Record<string, any> }>()

  const includeGroups = computed(() => [
    {
      field: 'include',
      legend: t('common.options'),
      items: [
        INCLUDE.image,
        INCLUDE.additionalDetail,
        INCLUDE.clocks,
        INCLUDE.tables,
        INCLUDE.appendLined,
        INCLUDE.appendUnlined,
      ],
    },
  ])
</script>
