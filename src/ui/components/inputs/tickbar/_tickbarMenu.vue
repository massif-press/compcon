<template>
  <v-card tile
    class="pa-3"
    border>
    <div class="mb-2">
      <v-icon start
        :icon="icon"
        class="mt-n1" />
      <span class="heading">{{ label }}</span>
    </div>

    <slot />
    <v-row dense
      class="mt-1">
      <v-col>
        <v-btn flat
          color="primary"
          size="x-small"
          block
          tile
          @click="$emit('reset')">{{ $t('common.reset') }}</v-btn>
      </v-col>
      <v-col>
        <v-btn flat
          color="primary"
          size="x-small"
          block
          tile
          @click="$emit('set', 0)">{{ $t('common.clear') }}</v-btn>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue?: number
  icon?: string
  label?: string
}>(), {
  modelValue: 0,
  icon: 'mdi-keyboard-variant',
  label: 'Value'
})

const emit = defineEmits<{
  'set': []
  'reset': []
}>()
</script>
