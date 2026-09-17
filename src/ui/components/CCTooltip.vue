<template>
  <v-tooltip
    v-model="active"
    :disabled="props.disabled || !hasContent"
    :location="touch ? 'top' : location"
    :max-width="maxWidth"
    :open-on-hover="false"
    :open-on-click="touch"
    :transition="transition"
  >
    <template #activator="act">
      <slot
        name="activator"
        v-bind="withHandlers(act)"
      >
        <v-icon
          v-bind="withHandlers(act).props"
          :icon="icon || 'mdi-information-slab-box-outline'"
          :color="color"
          :size="size"
          :start="start"
          :end="end"
          style="align-self: center; margin-top: -3px"
        />
      </slot>
    </template>
    <template #default>
      <slot v-if="!text" />
      <span
        v-else
        v-html-safe="text"
      />
    </template>
  </v-tooltip>
</template>

<script lang="ts">
  // Page-wide tooltip warmth, shared by all CCTooltip instances.
  import { ref } from 'vue'

  /** Delay before a cold tooltip opens (ms). */
  export const TOOLTIP_OPEN_DELAY = 200
  /** How long the page stays "warm" after a tooltip closes (ms). */
  export const TOOLTIP_WARM_WINDOW = 300

  const warmUntil = ref(0)

  /** The close callback of the currently open tooltip, if any. Any new hover
   * force-closes it, so a lost mouseleave can never wedge the UI. */
  let current: (() => void) | null = null

  export function isWarm(now: number = Date.now()): boolean {
    return now < warmUntil.value
  }

  export function markWarm(): void {
    warmUntil.value = Date.now() + TOOLTIP_WARM_WINDOW
  }

  /** Test-only. */
  export function resetWarm(): void {
    warmUntil.value = 0
  }
</script>

<script setup lang="ts">
  import { Comment, computed, Fragment, onScopeDispose, useSlots, watch } from 'vue'
  import type { Anchor } from 'vuetify'

  // Timing model (https://blog.master.dev/tooltips-need-a-delay-and-then-they-need-to-skip-it/):
  // hover -> wait TOOLTIP_OPEN_DELAY -> tooltip opens (page is warm); leave ->
  // tooltip closes -> TOOLTIP_WARM_WINDOW cooldown. Hovering another tooltip
  // while warm opens it instantly and skips the open animation.
  //
  // VTooltip's own hover machinery is disabled because it reads its open-delay
  // prop from the last render, so a dynamic delay cannot take effect at hover
  // time. CCTooltip drives `v-model` itself instead.
  const props = withDefaults(
    defineProps<{
      text?: string
      icon?: string
      color?: string
      size?: string | number
      start?: boolean
      end?: boolean
      location?: Anchor
      maxWidth?: string | number
      disabled?: boolean
    }>(),
    {
      location: 'top',
      maxWidth: 350,
    }
  )

  const slots = useSlots()

  const touch = 'ontouchstart' in window || navigator.maxTouchPoints > 0

  // A default slot may exist but render nothing (e.g. it only forwards a
  // caller's named slot that was not provided, or holds a false v-if), which
  // Vue turns into comment vnodes / empty strings.
  const hasContent = computed(() => {
    if (props.text) return true
    const slot = slots.default
    if (!slot) return false
    const hasNodes = (nodes: any[]): boolean =>
      nodes.some(v => {
        if (v.type === Comment) return false
        if (typeof v.children === 'string') return v.children.trim() !== ''
        if (Array.isArray(v.children)) return hasNodes(v.children)
        if (v.children == null) return v.type !== Fragment
        return true
      })
    return hasNodes(slot())
  })

  const active = ref(false)
  const openedWarm = ref(false)

  const transition = computed(() => (openedWarm.value ? 'cc-instant' : undefined))

  let openTimer: ReturnType<typeof setTimeout> | undefined
  let hovering = false

  function close(): void {
    active.value = false
    openedWarm.value = false
    clearTimeout(openTimer)
  }

  function onEnter(): void {
    // Self-healing: force-close whatever tooltip is currently open (e.g. one
    // whose mouseleave was lost to a re-render).
    if (current && current !== close) current()
    current = close
    hovering = true
    if (props.disabled || !hasContent.value) return
    openedWarm.value = isWarm()
    if (openedWarm.value) {
      active.value = true
    } else {
      clearTimeout(openTimer)
      openTimer = setTimeout(() => {
        // never open if the cursor already moved on
        if (hovering) active.value = true
      }, TOOLTIP_OPEN_DELAY)
    }
  }

  function onLeave(): void {
    hovering = false
    clearTimeout(openTimer)
    if (current === close) current = null
    if (active.value) {
      markWarm()
      openedWarm.value = false
      active.value = false
    }
  }

  // a tooltip whose content disappears or becomes disabled must not linger
  watch(
    () => props.disabled || !hasContent.value,
    v => {
      if (v) close()
    }
  )

  function withHandlers(act: Record<string, any>): Record<string, any> {
    // Keep VTooltip's bindings (notably the positioning ref); on touch devices
    // click-to-open is handled by VTooltip itself.
    const handlers = touch
      ? {}
      : {
          onMouseenter: onEnter,
          onMouseleave: onLeave,
          onFocus: () => {
            if (props.disabled || !hasContent.value) return
            openedWarm.value = false
            active.value = true
          },
          onBlur: () => {
            hovering = false
            if (current === close) current = null
            openedWarm.value = false
            active.value = false
          },
        }
    return { ...act, props: { ...act.props, ...handlers } }
  }

  onScopeDispose(() => {
    clearTimeout(openTimer)
    if (current === close) current = null
  })
</script>
