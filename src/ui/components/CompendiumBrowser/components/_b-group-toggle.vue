<template>
  <v-btn-toggle
    v-model="internalValue"
    mandatory
    divided
    variant="plain"
    border
    tile
    color="accent"
    density="compact"
    style="width: 100%; height: 30px"
    class="mb-2"
  >
    <v-tooltip
      v-for="g in options.groups"
      :key="`group-${g}`"
      :text="groupTooltip(g)"
      location="top"
    >
      <template #activator="{ props }">
        <v-btn
          v-bind="props"
          :value="g"
          icon
          tile
          size="small"
          :style="`width: ${100 / options.groups.length}%`"
        >
          <v-icon
            size="25"
            :icon="groupIcon(g)"
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

  defineOptions({ name: 'BrowserGroupToggle' })

  const props = defineProps<{
    modelValue: string
    options: BrowserOptions
  }>()

  const emit = defineEmits<{
    'update:modelValue': [payload: any]
  }>()

  const internalValue = computed({
    get: () => props.modelValue,
    set: value => {
      emit('update:modelValue', value)
    },
  })

  function groupIcon(i: string) {
    switch (i) {
      case 'source':
        return 'cc:manufacturer'
      case 'lcp':
        return 'cc:content_manager'
      case 'type':
        return 'cc:generic_item'
      case 'license':
        return 'cc:license'
      case 'role':
        return 'cc:role_support'
      case 'featureType':
        return 'cc:npc_feature'
      case 'origin':
        return 'cc:npc_template'
      case 'bond':
        return 'mdi-link-variant'
      case 'none':
        return 'mdi-cancel'
      default:
        return ''
    }
  }
  function groupTooltip(i: string) {
    switch (i) {
      case 'source':
        return t('ui.compendiumBrowser.group.source')
      case 'lcp':
        return t('ui.compendiumBrowser.group.lcp')
      case 'license':
        return t('ui.compendiumBrowser.group.license')
      case 'type':
        return t('ui.compendiumBrowser.group.type')
      case 'role':
        return t('ui.compendiumBrowser.group.role')
      case 'featureType':
        return t('ui.compendiumBrowser.group.featureType')
      case 'origin':
        return t('ui.compendiumBrowser.group.origin')
      case 'bond':
        return t('ui.compendiumBrowser.group.bond')
      case 'none':
        return t('ui.compendiumBrowser.group.none')
      default:
        return ''
    }
  }
</script>
