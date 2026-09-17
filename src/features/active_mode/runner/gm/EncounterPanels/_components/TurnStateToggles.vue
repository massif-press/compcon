<template>
  <v-row
    no-gutters
    align="stretch"
  >
    <template
      v-for="(state, i) in visible"
      :key="state.key"
    >
      <v-divider
        v-if="i"
        vertical
        class="d-none d-sm-block"
      />
      <v-col
        cols="6"
        sm=""
      >
        <v-btn
          flat
          tile
          block
          class="turn-state-toggle"
          :size="layout.btnSize"
          :color="state.active ? 'primary' : 'panel'"
          :aria-pressed="String(state.active)"
          :text="state.label"
          @click="attempt(state)"
        />
      </v-col>
    </template>
    <cc-force-override
      v-model="prompt"
      :reason="blocked?.reason || 'unavailable'"
      :action="blocked?.label"
      @confirm="force()"
    />
  </v-row>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { useLayoutOptions } from '@/features/active_mode/layoutOptions'
  import CcForceOverride from '@/ui/components/modals/CCForceOverride.vue'

  export type TurnState = {
    key: string
    label: string
    active: boolean
    show?: boolean
    reason?: string
    toggle: () => boolean | void
    forceToggle?: () => void
  }

  defineOptions({ name: 'TurnStateToggles' })

  const props = defineProps<{ states: TurnState[] }>()
  const { layout } = useLayoutOptions()

  const visible = computed(() => props.states.filter(s => s.show !== false))

  const prompt = ref(false)
  const blocked = ref<TurnState | null>(null)

  function attempt(state: TurnState) {
    if (state.toggle() !== false || !state.forceToggle) return
    blocked.value = state
    prompt.value = true
  }

  function force() {
    blocked.value?.forceToggle?.()
    blocked.value = null
  }
</script>

<style scoped>
  .turn-state-toggle {
    min-height: 32px;
  }
</style>
