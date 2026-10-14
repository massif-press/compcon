<template>
  <v-select
    :model-value="modelValue"
    :items="items"
    :label="$t('nav.settingsPage.turnWizardClosePolicyLabel')"
    density="compact"
    variant="outlined"
    hide-details
    @update:model-value="$emit('update:modelValue', $event)"
  />
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { TURN_WIZARD_CLOSE_POLICIES, type TurnWizardClosePolicy } from '../turnWizard'

  defineOptions({ name: 'TurnWizardCloseSelect' })

  defineProps<{ modelValue?: TurnWizardClosePolicy }>()
  defineEmits<{ 'update:modelValue': [value: TurnWizardClosePolicy] }>()
  const { t } = useI18n()

  const items = computed(() =>
    TURN_WIZARD_CLOSE_POLICIES.map(value => ({
      value,
      title: t(`nav.settingsPage.turnWizardClosePolicy.${value}`),
    }))
  )
</script>
