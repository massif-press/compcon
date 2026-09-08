<template>
  <div>
    <div class="text-cc-overline text-disabled">{{ $t('common.actions') }}</div>
    <v-row
      dense
      align="stretch"
    >
      <template
        v-for="(action, idx) in actions"
        :key="action.key"
      >
        <v-col
          v-if="action.separator"
          cols="auto"
          class="d-flex align-center justify-center"
          aria-hidden="true"
        >
          <v-icon
            size="small"
            class="text-disabled"
            icon="mdi-swap-horizontal"
          />
        </v-col>
        <v-col
          v-else
          cols="6"
          sm="4"
          md="4"
          lg=""
        >
          <cc-tooltip :text="layout.showLabel ? undefined : action.label" location="top">
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                :color="action.available ? action.color : 'grey'"
                flat
                tile
                block
                :class="[
                  `combat-action-tile px-${layout.padX}`,
                  { 'combat-action-tile--spent': !action.available },
                ]"
                :height="layout.tileHeight"
                :aria-pressed="action.readonly ? undefined : String(action.available)"
                :aria-label="action.label"
                :readonly="action.readonly"
                @click="action.readonly ? undefined : action.toggle?.()"
              >
            <div
              class="d-flex flex-column align-center justify-center"
              style="line-height: 1.1"
            >
              <v-icon
                v-if="layout.showIcon"
                :size="layout.tileIconSize"
                :icon="action.icon"
              />
              <span
                v-if="layout.showLabel"
                class="text-cc-overline combat-action-label"
              >
                {{ action.label }}
              </span>
              <span
                v-else-if="!action.available"
                class="text-caption text-disabled"
              >
                {{ $t('active.combatAction.spent') }}
              </span>
            </div>
              <v-icon
                v-if="!action.available && !action.readonly && !layout.showLabel"
                class="combat-action-spent-mark"
                size="14"
                icon="mdi-close-thick"
              />
            </template>
          </cc-tooltip>
        </v-col>
        <v-responsive
          v-if="action.breakAfter && layout.showLabel"
          :key="`b${idx}`"
          width="100%"
        />
      </template>
    </v-row>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import type { CombatController } from '@/classes/components/combat/CombatController'
  import { useLayoutOptions } from '@/features/active_mode/layoutOptions'

  defineOptions({ name: 'CombatActionPanel' })

  const props = withDefaults(
    defineProps<{
      controller: CombatController
      hideOvercharge?: boolean
    }>(),
    { hideOvercharge: false }
  )

  const { t } = useI18n()
  const { layout } = useLayoutOptions()

  const movement = computed(() => props.controller.StatController?.CurrentStats['speed'] || 0)

  type Tile = {
    key: string
    icon?: string
    label?: string
    color?: string
    available?: boolean
    readonly?: boolean
    value?: number
    separator?: boolean
    breakAfter?: boolean
    toggle?: () => void
  }

  const actions = computed<Tile[]>(() => {
    const c = props.controller
    const tiles: Tile[] = [
      {
        key: 'protocol',
        icon: 'cc:protocol',
        label: t('active.combatAction.protocol'),
        color: 'action--protocol',
        available: c.CanActivate('protocol'),
        toggle: () => c.toggleCombatAction('protocol'),
      },
      {
        key: 'full',
        icon: 'mdi-hexagon-slice-6',
        label: t('active.combatAction.full'),
        color: 'action--full',
        available: c.CanActivate('full'),
        toggle: () => c.toggleCombatAction('full'),
      },
      { key: 'sep', separator: true },
      {
        key: 'quick1',
        icon: 'mdi-hexagon-slice-3',
        label: t('active.combatAction.quickN', { n: 1 }),
        color: 'action--quick',
        available: c.CombatActions.Quick1,
        toggle: () => (c.CombatActions.Quick1 = !c.CombatActions.Quick1),
      },
      {
        key: 'quick2',
        icon: 'mdi-hexagon-slice-3',
        label: t('active.combatAction.quickN', { n: 2 }),
        color: 'action--quick',
        available: c.CombatActions.Quick2,
        toggle: () => (c.CombatActions.Quick2 = !c.CombatActions.Quick2),
        breakAfter: true,
      },
      {
        key: 'move',
        icon: 'mdi-arrow-right-bold-hexagon-outline',
        label: t('active.combatAction.move'),
        color: 'action--move',
        available: c.CanActivate('move'),
        readonly: true,
        value: movement.value,
      },
    ]
    if (!props.hideOvercharge) {
      tiles.push({
        key: 'overcharge',
        icon: 'cc:overcharge',
        label: t('active.combatAction.overcharge'),
        color: 'overcharge',
        available: c.CanActivate('overcharge'),
        toggle: () => c.toggleCombatAction('overcharge'),
      })
    }
    tiles.push({
      key: 'reaction',
      icon: 'cc:reaction',
      label: t('active.combatAction.reaction'),
      color: 'action--reaction',
      available: c.CanActivate('reaction'),
      toggle: () => c.toggleCombatAction('reaction'),
    })
    return tiles
  })
</script>

<style scoped>
  .combat-action-tile {
    min-width: max(44px, 100%);
    min-height: 32px;
    position: relative;
    overflow: hidden;
  }

  .combat-action-label {
    white-space: nowrap;
    text-align: center;
  }

  .combat-action-tile--spent .combat-action-label {
    text-decoration: line-through;
  }

  .combat-action-tile--spent :deep(.v-icon) {
    opacity: 0.55;
  }

  .combat-action-spent-mark {
    position: absolute;
    top: 2px;
    right: 2px;
    opacity: 0.9;
  }
</style>
