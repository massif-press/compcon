<template>
  <v-tooltip :text="label"
    location="top"
    open-delay="400">
    <template #activator="{ props: tip }">
      <span v-bind="tip"
        class="mr-7"
        :class="stacked ? 'd-inline-flex flex-column align-center' : 'text-no-wrap'">
        <span class="text-no-wrap">
          <v-icon v-if="layout.showIcon"
            :icon="icon"
            :size="layout.iconSize"
            :class="mobile ? 'mr-1' : 'mt-n2 mr-1'" />
          <span v-if="layout.showLabel && !stacked"
            class="text-caption text-disabled mr-1">
            {{ label }}
          </span>
          <span :class="mobile || (layout.showLabel && !stacked) ? '' : 'h2'"
            class="heading text-accent">
            {{ value }}
          </span>
        </span>
        <span v-if="stacked"
          class="text-caption text-disabled text-uppercase"
          style="line-height: 1">
          {{ label }}
        </span>
      </span>
    </template>
  </v-tooltip>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDisplay } from 'vuetify'
import { useLayoutOptions } from '@/features/active_mode/layoutOptions'

defineOptions({ name: 'StaticStat' })

defineProps<{
  icon: string
  label: string
  value: string | number
}>()

const { mdAndDown: mobile } = useDisplay()
const { layout } = useLayoutOptions()
const stacked = computed(() => layout.value.showIcon && layout.value.showLabel)
</script>
