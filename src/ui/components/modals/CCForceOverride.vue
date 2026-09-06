<template>
  <v-dialog
    :model-value="modelValue"
    max-width="600"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <cc-confirmation
      full-width
      cancellable
      :content="content"
      @cancel="$emit('update:modelValue', false)"
      @confirm="confirm()"
    />
  </v-dialog>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'

  defineOptions({ name: 'CcForceOverride' })

  const props = withDefaults(
    defineProps<{
      modelValue: boolean
      reason?: string
      action?: string
    }>(),
    { reason: 'unavailable', action: '' }
  )

  const emit = defineEmits<{
    'update:modelValue': [value: boolean]
    confirm: []
  }>()

  function confirm() {
    emit('update:modelValue', false)
    emit('confirm')
  }

  const { t, te } = useI18n()

  const content = computed(() => {
    const key = `active.log.blockedReason.${props.reason}`
    const reason = te(key) ? t(key) : t('active.log.blockedReason.unavailable')
    return props.action
      ? t('active.override.promptNamed', { action: props.action, reason })
      : t('active.override.prompt', { reason })
  })
</script>
