<template>
  <span v-if="count || modelValue">
    <v-tooltip
      location="top"
      :text="
        modelValue
          ? showingText || $t('active.weaponSelect.showingUnavailable')
          : hidingText || $t('active.weaponSelect.hidingUnavailable')
      "
    >
      <template #activator="{ props }">
        <v-btn
          v-bind="props"
          size="small"
          icon
          variant="text"
          flat
          tile
          @click="$emit('update:modelValue', !modelValue)"
        >
          <v-icon
            :color="modelValue ? '' : 'primary'"
            size="18"
            icon="mdi-eye-off"
          />
        </v-btn>
      </template>
    </v-tooltip>
    <span
      v-if="count && !modelValue"
      class="text-cc-overline"
      style="opacity: 0.75"
    >
      +{{ count }} {{ $t('active.weaponSelect.unavailableCount') }}
    </span>
  </span>
</template>

<script setup lang="ts">
  defineOptions({ name: 'UnavailableToggle' })

  withDefaults(
    defineProps<{
      modelValue?: boolean
      count?: number
      showingText?: string
      hidingText?: string
    }>(),
    {
      modelValue: false,
      count: 0,
      showingText: '',
      hidingText: '',
    }
  )

  defineEmits<{ 'update:modelValue': [value: boolean] }>()
</script>
