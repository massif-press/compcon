<template>
  <print-options-base
    :options="options"
    :layout-options="layoutOptions"
    :content-options="contentOptions"
    :bonds-options="hasBonds ? bondsOptions : undefined"
    :card-options="cardOptions"
    :include-groups="includeGroups"
    :extra-options="extraOptions"
  />
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import PrintOptionsBase from '@/shared/print/PrintOptionsBase.vue'
  import { LAYOUT, CONTENT, BONDS, CARD, INCLUDE, EXTRA } from '@/ui/print/options'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()

  defineOptions({ name: 'PrintOptionsDialog' })

  const props = defineProps<{
    hasBonds: boolean
    options: any
  }>()

  const layoutOptions = Object.values(LAYOUT)
  const contentOptions = Object.values(CONTENT)
  const bondsOptions = Object.values(BONDS)
  const cardOptions = Object.values(CARD)

  const isBlank = computed(() => props.options.content.key === CONTENT.blank.key)

  const blankSpace = computed(() =>
    isBlank.value ? [INCLUDE.extraMountPanel, INCLUDE.extraSystemSpace] : []
  )

  const appendSections = [INCLUDE.appendUnlined, INCLUDE.appendLined]

  const pilotIncludeOptions = computed(() => {
    switch (props.options.layout.key) {
      case LAYOUT.terse.key:
        return [
          INCLUDE.pilotPortrait,
          INCLUDE.separateTalentDetail,
          INCLUDE.appearanceNotes,
          INCLUDE.pilotBiography,
          INCLUDE.pilotNotes,
          INCLUDE.extraEquipmentSpace,
          INCLUDE.extraReserveSpace,
          ...appendSections,
        ]
      case LAYOUT.standard.key:
        return [
          INCLUDE.expandedTags,
          INCLUDE.separateTalentDetail,
          INCLUDE.appearanceNotes,
          INCLUDE.extraEquipmentSpace,
          INCLUDE.extraReserveSpace,
          ...appendSections,
        ]
      case LAYOUT.expanded.key:
        return [
          INCLUDE.expandedTags,
          INCLUDE.separateTalentDetail,
          INCLUDE.extraEquipmentSpace,
          INCLUDE.extraReserveSpace,
          INCLUDE.expandedMissionLog,
          ...appendSections,
        ]
      default:
        return []
    }
  })

  const mechIncludeOptions = computed(() => {
    switch (props.options.layout.key) {
      case LAYOUT.minimal.key:
        return blankSpace.value
      case LAYOUT.terse.key:
        return [INCLUDE.mechImage, INCLUDE.mechNotes, ...blankSpace.value, ...appendSections]
      case LAYOUT.standard.key:
        return [INCLUDE.expandedTags, ...blankSpace.value, ...appendSections]
      case LAYOUT.expanded.key:
        return [...blankSpace.value, ...appendSections]
      default:
        return []
    }
  })

  const includeGroups = computed(() => [
    {
      field: 'pilotInclude',
      legend: t('pm.print.pilotSheetOptions'),
      items: pilotIncludeOptions.value,
    },
    {
      field: 'mechInclude',
      legend: t('pm.print.mechSheetOptions'),
      items: mechIncludeOptions.value,
    },
  ])

  const extraOptions = [
    EXTRA.tagRef,
    EXTRA.triggerRef,
    EXTRA.combatRef,
    EXTRA.actionRef,
    EXTRA.downtimeRef,
  ]
</script>
