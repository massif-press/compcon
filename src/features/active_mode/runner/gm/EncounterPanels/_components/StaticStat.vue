<template>
  <v-tooltip :text="rollable ? rollLabel : label"
    location="top"
    open-delay="400">
    <template #activator="{ props: tip }">
      <span v-bind="mergeProps(tip, rollProps)"
        class="mr-7"
        :class="[
          stacked ? 'd-inline-flex flex-column align-center' : 'text-no-wrap',
          { 'static-stat--rollable': rollable },
        ]">
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
import { computed, inject, mergeProps } from 'vue'
import { useDisplay } from 'vuetify'
import { useI18n } from 'vue-i18n'
import { useLayoutOptions } from '@/features/active_mode/layoutOptions'
import { RollCheckKey } from '../encounterContext'
import type { CheckType } from '@/classes/components/combat/stats/Stats'

defineOptions({ name: 'StaticStat' })

const props = defineProps<{
  icon: string
  label: string
  value: string | number
  check?: CheckType
}>()

const { t } = useI18n()
const { mdAndDown: mobile } = useDisplay()
const { layout } = useLayoutOptions()
const stacked = computed(() => layout.value.showIcon && layout.value.showLabel)

const rollCheck = inject(RollCheckKey, undefined)
const rollable = computed(() => !!props.check && !!rollCheck)
const rollLabel = computed(() => t('active.panelBase.rollCheck', { stat: props.label }))

function roll(e: Event) {
  e.preventDefault()
  rollCheck?.(props.check!)
}

const rollProps = computed(() =>
  rollable.value
    ? {
        role: 'button',
        tabindex: 0,
        'aria-label': rollLabel.value,
        onClick: roll,
        onKeydown: (e: KeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ') roll(e)
        },
      }
    : {}
)
</script>

<style scoped>
.static-stat--rollable {
  cursor: pointer;
  min-width: 24px;
  min-height: 24px;
}

.static-stat--rollable:hover,
.static-stat--rollable:focus-visible {
  outline: 1px solid rgb(var(--v-theme-accent));
  outline-offset: 2px;
}
</style>
