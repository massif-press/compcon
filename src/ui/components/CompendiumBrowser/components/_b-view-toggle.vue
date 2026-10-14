<template>
  <v-btn-toggle
    v-model="internalValue"
    mandatory
    divided
    variant="plain"
    tile
    border
    color="accent"
    density="compact"
    style="width: 100%; height: 30px"
    class="mb-2"
  >
    <v-tooltip
      v-for="v in options.views"
      :key="`view-${v}`"
      :text="viewTooltip(v)"
      location="top"
    >
      <template #activator="{ props }">
        <v-btn
          v-bind="props"
          :value="v"
          tile
          icon
          size="small"
          :style="`width: ${100 / options.views.length}%`"
        >
          <v-icon
            size="25"
            :icon="viewIcon(v)"
          />
        </v-btn>
      </template>
    </v-tooltip>
  </v-btn-toggle>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import type { BrowserOptions } from '../browserContext'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()

  defineOptions({ name: 'browser-view-toggle' })

  const props = defineProps<{
    modelValue: string
    options: BrowserOptions
  }>()

  const emit = defineEmits<{
    'update:modelValue': [value: string]
  }>()

  const internalValue = computed({
    get: () => props.modelValue,
    set: (value: string) => emit('update:modelValue', value),
  })

  function viewIcon(i: string) {
    switch (i) {
      case 'single':
        return 'mdi-card-bulleted-outline'
      case 'list':
        return 'mdi-view-list'
      case 'table':
        return 'mdi-table'
      case 'cards':
        return 'mdi-view-grid'
      case 'scatter':
        return 'mdi-chart-scatter-plot'
      case 'bar':
        return 'mdi-chart-bar'
      case 'compare':
        return 'mdi-compare'
      default:
        return ''
    }
  }
  function viewTooltip(i: string) {
    switch (i) {
      case 'single':
        return t('ui.compendiumBrowser.view.single')
      case 'list':
        return t('ui.compendiumBrowser.view.list')
      case 'table':
        return t('ui.compendiumBrowser.view.table')
      case 'cards':
        return t('ui.compendiumBrowser.view.cards')
      case 'scatter':
        return t('ui.compendiumBrowser.view.scatter')
      case 'bar':
        return t('ui.compendiumBrowser.view.bar')
      case 'compare':
        return t('ui.compendiumBrowser.view.compare')
      default:
        return ''
    }
  }
</script>
