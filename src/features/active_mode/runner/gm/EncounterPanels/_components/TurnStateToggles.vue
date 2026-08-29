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
          @click="state.toggle()"
        />
      </v-col>
    </template>
  </v-row>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useLayoutOptions } from '@/features/active_mode/layoutOptions'

  export type TurnState = {
    key: string
    label: string
    active: boolean
    show?: boolean
    toggle: () => void
  }

  defineOptions({ name: 'TurnStateToggles' })

  const props = defineProps<{ states: TurnState[] }>()
  const { layout } = useLayoutOptions()

  const visible = computed(() => props.states.filter(s => s.show !== false))
</script>

<style scoped>
  .turn-state-toggle {
    min-height: 32px;
  }
</style>
