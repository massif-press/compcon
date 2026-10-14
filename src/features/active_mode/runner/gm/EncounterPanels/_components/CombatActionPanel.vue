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
          <v-btn
            :color="action.available ? action.color : 'grey'"
            flat
            tile
            block
            :class="[
              `combat-action-tile px-${layout.padX}`,
              { 'combat-action-tile--spent': !action.available },
            ]"
            :height="layout.tileHeight"
            :aria-pressed="
              action.readonly || hasMenu(action) ? undefined : String(action.available)
            "
            :aria-label="tileLabel(action)"
            :readonly="action.readonly"
            @click="action.readonly || hasMenu(action) ? undefined : action.toggle?.()"
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
                v-if="!action.available && layout.showLabel"
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
            <v-tooltip
              v-if="!layout.showLabel"
              activator="parent"
              location="top"
              :text="action.label"
            />
            <v-menu
              v-if="hasMenu(action)"
              activator="parent"
              :close-on-content-click="false"
              location="bottom"
            >
              <v-card
                tile
                border
                color="background"
                class="pa-2"
                style="width: min(360px, 95vw); max-height: 70vh; overflow-y: auto"
              >
                <cc-button
                  v-if="action.toggle"
                  size="x-small"
                  block
                  class="mb-2"
                  :color="action.available ? action.color : 'primary'"
                  :prepend-icon="action.available ? action.icon : 'mdi-undo'"
                  @click="action.toggle()"
                >
                  {{
                    $t(
                      action.available
                        ? 'active.actionPalette.markUsed'
                        : 'active.actionPalette.markUnused',
                      { type: action.pool ?? action.label }
                    )
                  }}
                </cc-button>
                <slot
                  name="menu"
                  :tile="action.tile!"
                />
              </v-card>
            </v-menu>
          </v-btn>
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
  import { computed, useSlots } from 'vue'
  import { useI18n } from 'vue-i18n'
  import type { CombatController } from '@/classes/components/combat/CombatController'
  import { Action } from '@/classes/Action'
  import { ActivationType } from '@/classes/enums'
  import { useLayoutOptions } from '@/features/active_mode/layoutOptions'
  import type { PaletteTile } from './actionPalette'

  defineOptions({ name: 'CombatActionPanel' })

  const props = withDefaults(
    defineProps<{
      controller: CombatController
      hideOvercharge?: boolean
    }>(),
    { hideOvercharge: false }
  )

  defineSlots<{ menu?(props: { tile: PaletteTile }): any }>()

  const { t } = useI18n()
  const { layout } = useLayoutOptions()
  const slots = useSlots()

  const menus = computed(() => layout.value.actionGrouping === 'menus' && !!slots.menu)

  function hasMenu(tile: Tile): boolean {
    return menus.value && !!tile.tile
  }

  function tileLabel(tile: Tile): string | undefined {
    if (!hasMenu(tile) || tile.available) return tile.label
    return `${tile.label}, ${t('active.combatAction.spent')}`
  }

  const movement = computed(() => props.controller.StatController?.CurrentStats['speed'] || 0)
  const inOvercharge = computed(() => props.controller.InOvercharge)

  type Tile = {
    key: string
    icon?: string
    label?: string
    color?: string
    available?: boolean
    readonly?: boolean
    value?: number
    tile?: PaletteTile
    pool?: string
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
        label: t('enums.activationType.protocol'),
        color: 'action--protocol',
        available: c.CanActivate('protocol'),
        tile: 'protocol',
        toggle: () => c.toggleCombatAction('protocol'),
      },
      {
        key: 'full',
        icon: 'mdi-hexagon-slice-6',
        label: t('enums.activationType.full'),
        color: 'action--full',
        available: c.CanActivate('full'),
        tile: 'full',
        toggle: () => c.toggleCombatAction('full'),
      },
      { key: 'sep', separator: true },
      {
        key: 'quick1',
        icon: inOvercharge.value ? 'cc:overcharge' : 'mdi-hexagon-slice-3',
        label: t('active.combatAction.quickN', { n: 1 }),
        color: inOvercharge.value ? 'action--overcharge' : 'action--quick',
        available: c.CanActivate('quick1'),
        tile: 'quick',
        pool: t('enums.activationType.quick'),
        toggle: () => c.toggleCombatAction('quick1'),
      },
      {
        key: 'quick2',
        icon: inOvercharge.value ? 'cc:overcharge' : 'mdi-hexagon-slice-3',
        label: t('active.combatAction.quickN', { n: 2 }),
        color: inOvercharge.value ? 'action--overcharge' : 'action--quick',
        available: c.CanActivate('quick2'),
        tile: 'quick',
        pool: t('enums.activationType.quick'),
        toggle: () => c.toggleCombatAction('quick2'),
        breakAfter: true,
      },
    ]
    if (c.TracksMovement) {
      tiles.push({
        key: 'move',
        icon: 'mdi-arrow-right-bold-hexagon-outline',
        label: t('enums.activationType.move'),
        color: 'action--move',
        available: c.CanActivate('move'),
        readonly: true,
        value: movement.value,
      })
    }
    if (!props.hideOvercharge) {
      tiles.push({
        key: 'overcharge',
        icon: 'cc:overcharge',
        label: inOvercharge.value
          ? t('active.combatAction.overchargeReady')
          : t('active.combatAction.overcharge'),
        color: 'overcharge',
        available: c.CanActivate('overcharge') || inOvercharge.value,
        tile: 'overcharge',
        pool: t('active.combatAction.overcharge'),
        toggle: () => c.toggleCombatAction('overcharge'),
      })
    }
    tiles.push({
      key: 'reaction',
      icon: 'cc:reaction',
      label:
        t('enums.activationType.reaction') +
        (c.ActionPoolController.ExtraActionsLeft('reaction') > 0
          ? ` +${c.ActionPoolController.ExtraActionsLeft('reaction')}`
          : ''),
      color: 'action--reaction',
      available: c.CanActivate('reaction'),
      tile: 'reaction',
      toggle: () => c.toggleCombatAction('reaction'),
    })
    if (menus.value && c.AllActions('Free').some(a => a.ID !== 'act_overcharge')) {
      tiles.push({
        key: 'free',
        icon: Action.getIcon(ActivationType.Free),
        label: t('enums.activationType.free'),
        color: Action.colorFor('Free'),
        available: true,
        tile: 'free',
      })
    }
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
