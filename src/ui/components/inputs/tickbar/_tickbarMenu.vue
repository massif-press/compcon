<template>
  <v-card
    tile
    class="pa-3"
    border
  >
    <div class="mb-2">
      <v-icon
        start
        :icon="icon"
        class="mt-n1"
      />
      <span class="heading">{{ label ?? $t('common.value') }}</span>
    </div>

    <slot />
    <v-row
      dense
      class="mt-1"
    >
      <v-col>
        <v-btn
          flat
          color="primary"
          size="x-small"
          block
          tile
          @click="$emit('reset')"
        >
          {{ $t('common.resetAction') }}
        </v-btn>
      </v-col>
      <v-col>
        <v-btn
          flat
          color="primary"
          size="x-small"
          block
          tile
          @click="$emit('set', 0)"
        >
          {{ $t('common.clearAction') }}
        </v-btn>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  const { t } = useI18n()
  const props = withDefaults(
    defineProps<{
      modelValue?: number
      icon?: string
      label?: string
    }>(),
    {
      modelValue: 0,
      icon: 'mdi-keyboard-variant',
    }
  )

  const emit = defineEmits<{
    set: [payload: number]
    reset: []
  }>()
</script>
