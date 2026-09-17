<template>
  <div v-if="show"
    class="d-flex justify-end align-center flex-wrap ga-4 px-4 py-2">
    <cc-checkbox v-for="(t, idx) in targets"
      :key="`kill-${idx}`"
      v-model="t.ConfirmedKill"
      size="small"
      active-color="error"
      :label="label(idx)" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { ActiveEffectEvent } from '@/classes/components/feature/active_effects/ActiveEffectEvent'
import type { ActiveEventTarget } from '@/classes/components/feature/active_effects/effect_events/eventTarget'
import { killTargets } from './killTargets'

const { t: tr } = useI18n()

const props = defineProps<{
  event: ActiveEffectEvent | ActiveEffectEvent[]
}>()

const events = computed((): ActiveEffectEvent[] =>
  Array.isArray(props.event) ? props.event : [props.event]
)

const isPcLocal = computed((): boolean => events.value.some(e => e?.IsPcLocal))

const dealsDamage = computed((): boolean =>
  events.value.some(e => !!e?.Weapon || !!e?.Effect?.Damage?.length)
)

const targets = computed((): ActiveEventTarget[] => killTargets(events.value))

const show = computed(
  (): boolean => isPcLocal.value && dealsDamage.value && !!targets.value.length
)

function ordinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'],
    v = n % 100
  return `${n}${s[(v - 20) % 10] || s[v] || s[0]}`
}

function label(idx: number): string {
  const text = tr('ui.combat.confirmKill')
  return targets.value.length > 1 ? `${ordinal(idx + 1)} ${text}` : text
}
</script>
