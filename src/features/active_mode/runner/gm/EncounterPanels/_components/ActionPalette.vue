<template>
  <div :class="grouping === 'none' ? 'mt-4' : 'mt-1'">
    <div v-if="grouping === 'none' || hiding"
      class="d-flex align-center mb-n2">
      <div v-if="grouping === 'none'"
        class="text-cc-overline text-disabled">
        {{ $t('active.runner.allActions') }}
      </div>
      <v-spacer />
      <unavailable-toggle v-if="hiding"
        v-model="showUnavailable"
        :count="hiddenCount"
        :showing-text="$t('active.playMode.showingUnavailableActions')"
        :hiding-text="$t('active.playMode.hidingUnavailableActions')" />
    </div>

    <v-row v-if="grouping === 'none'"
      dense>
      <v-col v-for="e in shown"
        :key="entryKey(e)"
        cols="12"
        sm="6"
        md="4">
        <action-palette-item :action="e.action"
          :controller="controller"
          :actor="actor"
          @deploy="$emit('deploy', $event)">
          <slot name="button"
            v-bind="e" />
        </action-palette-item>
      </v-col>
    </v-row>

    <template v-else-if="wizard">
      <div v-if="overcharge"
        class="ml-auto mt-2 mb-n4"
        style="width: fit-content; min-width: 25%">
        <action-palette-item :action="overcharge.action"
          :controller="controller"
          :actor="actor">
          <slot name="button"
            v-bind="overcharge" />
        </action-palette-item>
      </div>
      <fieldset v-for="p in panels"
        :key="p.key"
        class="px-2 pb-2 my-4"
        :style="`border: 2px solid rgb(var(--v-theme-${p.color}, 128, 128, 128)); border-radius: 4px`">
        <legend class="heading h4 px-2">
          <v-icon v-if="p.icon"
            :icon="p.icon"
            :color="p.color"
            start />
          {{ p.title }}
          <span class="text-caption text-disabled">({{ p.count }})</span>
        </legend>
        <v-row dense>
          <v-col v-for="e in p.rows.flat(3)"
            :key="entryKey(e)"
            style="flex: 1 0 25%">
            <action-palette-item :action="e.action"
              :controller="controller"
              :actor="actor"
              @deploy="$emit('deploy', $event)">
              <slot name="button"
                v-bind="e" />
            </action-palette-item>
          </v-col>
        </v-row>
      </fieldset>
    </template>

    <v-expansion-panels v-else
      focusable
      tile
      color="panel"
      flat
      :multiple="grouping === 'byType'"
      :variant="grouping === 'byType' ? 'accordion' : 'default'">
      <v-expansion-panel v-for="p in panels"
        :key="p.key">
        <v-expansion-panel-title class="heading h4 py-0"
          :color="p.color">
          <v-icon v-if="p.icon"
            :icon="p.icon"
            start />
          {{ p.title }}
        </v-expansion-panel-title>
        <v-expansion-panel-text style="border: 2px solid rgb(var(--v-theme-panel))">
          <v-row v-if="p.pools.length"
            dense
            class="mb-1">
            <template v-for="pp in p.pools"
              :key="pp.key">
              <v-col v-if="pp.canUse">
                <cc-button size="x-small"
                  block
                  :color="pp.color"
                  :prepend-icon="pp.icon"
                  @click="controller.SetCombatAction(pp.key, false)">
                  {{ $t('active.actionPalette.markUsed', { type: pp.label }) }}
                </cc-button>
              </v-col>
              <v-col v-if="pp.canRestore">
                <cc-button size="x-small"
                  block
                  color="primary"
                  prepend-icon="mdi-undo"
                  @click="controller.SetCombatAction(pp.key, true)">
                  {{ $t('active.actionPalette.markUnused', { type: pp.label }) }}
                </cc-button>
              </v-col>
            </template>
          </v-row>
          <template v-for="(row, ri) in p.rows"
            :key="ri">
            <v-divider v-if="ri"
              class="my-2" />
            <v-row align="start"
              dense>
              <v-col v-for="(col, ci) in row"
                :key="ci">
                <v-row dense>
                  <template v-for="(seg, si) in col"
                    :key="si">
                    <v-divider v-if="si"
                      class="my-1" />
                    <v-col v-for="e in seg"
                      :key="entryKey(e)">
                      <action-palette-item :action="e.action"
                        :controller="controller"
                        :actor="actor"
                        @deploy="$emit('deploy', $event)">
                        <slot name="button"
                          v-bind="e" />
                      </action-palette-item>
                    </v-col>
                  </template>
                </v-row>
              </v-col>
            </v-row>
          </template>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { CombatController } from '@/classes/components/combat/CombatController'
import { enumLabel } from '@/i18n/enumLabel'
import { Action } from '@/classes/Action'
import { CompendiumStore } from '@/stores'
import type { ActivationType } from '@/classes/enums'
import { useLayoutOptions } from '@/features/active_mode/layoutOptions'
import { useEncounterContext } from '../encounterContext'
import {
  groupByActivation,
  isActionAvailable,
  isActionLegal,
  entryKey,
  weaponEntries,
  EXHAUSTIBLE,
  MARKABLE,
  paletteEntries,
  standardRows,
  type PaletteActionIds,
  type PaletteEntry,
} from './actionPalette'
import ActionPaletteItem from './ActionPaletteItem.vue'
import UnavailableToggle from './loadouts/action_buttons/_unavailableToggle.vue'

defineOptions({ name: 'ActionPalette' })

const props = defineProps<{
  controller: CombatController
  actor: any
  ids: PaletteActionIds
  weaponActions?: boolean
}>()

defineEmits<{ deploy: [event: any] }>()
defineSlots<{ button(props: PaletteEntry): any }>()

const { t } = useI18n()
const { simple, wizard } = useEncounterContext()
const { layout } = useLayoutOptions()

const grouping = computed(() => (wizard ? 'byType' : layout.value.actionGrouping))
const hiding = computed(() => simple.value || wizard)
const showUnavailable = ref(false)

const actionById = computed(
  () => new Map<string, Action>(CompendiumStore().Actions.map((a: Action) => [a.ID, a]))
)
const entries = computed(() =>
  [
    ...(props.weaponActions ? weaponEntries(props.controller, actionById.value) : []),
    ...paletteEntries(props.controller, props.ids, simple.value, actionById.value),
  ].filter(e => !wizard || e.action.ID !== 'act_self_destruct')
)
const availableEntries = computed(() =>
  entries.value.filter(e =>
    wizard
      ? isActionLegal(props.controller, e.action, e.weapon)
      : isActionAvailable(props.controller, e.action)
  )
)
const shown = computed(() =>
  !hiding.value || showUnavailable.value ? entries.value : availableEntries.value
)
const hiddenCount = computed(() => entries.value.length - availableEntries.value.length)
const overcharge = computed(() =>
  wizard ? shown.value.find(e => e.action.ID === 'act_overcharge') : undefined
)

type Pool = {
  key: string
  label: string
  color: string
  icon: string
  canUse: boolean
  canRestore: boolean
}

function pool(type: string): Pool {
  const flags = props.controller.CombatActions
  return {
    key: type,
    label: enumLabel('activationType', type),
    color: Action.colorFor(type),
    icon: Action.getIcon(type as ActivationType),
    canUse: props.controller.CanActivate(type),
    canRestore: type === 'Quick' ? !flags.Quick1 || !flags.Quick2 : !flags.Full,
  }
}

const panels = computed<
  {
    key: string
    title: string
    color?: string
    icon?: string
    count?: number
    pools: Pool[]
    rows: PaletteEntry[][][][]
  }[]
>(() => {
  if (grouping.value === 'byType') {
    const available = new Set(availableEntries.value)
    const grouped = shown.value.filter(e => e !== overcharge.value)
    return groupByActivation(grouped, wizard ? [] : MARKABLE).map(([type, list]) => {
      const pools = !wizard && MARKABLE.includes(type) ? [pool(type)] : []
      const exhausted = EXHAUSTIBLE.includes(type) && !props.controller.CanActivate(type)
      return {
        key: type,
        title: enumLabel('activationType', type),
        color: exhausted ? 'grey' : Action.colorFor(type),
        icon: Action.getIcon(type as ActivationType),
        count: list.filter(e => available.has(e)).length,
        pools,
        rows: list.length ? [[[list]]] : [],
      }
    })
  }
  return [
    {
      key: 'all',
      title: t('active.runner.allActions'),
      pools: [],
      rows: standardRows(shown.value),
    },
  ]
})
</script>

<style scoped>
.v-expansion-panel-text :deep(.v-expansion-panel-text__wrapper) {
  padding: 8px;
}
</style>
