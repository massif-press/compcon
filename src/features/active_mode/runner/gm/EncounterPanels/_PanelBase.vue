<template>
  <slot name="header" />
  <cc-alert v-if="item.CombatController.IsDestroyed"
    class="ma-2 bg-stripes"
    prominent
    outlined>
    <div class="heading h2 pa-1 mr-n12 ml-n4 text-error"
      style="position: relative">
      <v-icon icon="cc:destroyed"
        size="x-large"
        start />
      {{ $t('active.panelBase.itemDestroyed', { type: item.ItemType }) }}
      <div
        style="position: absolute; top: 0; right: 0; bottom: 0; left: 0; z-index: -1; opacity: 0.85"
        class="bg-background" />
    </div>
  </cc-alert>
  <v-card flat
    tile
    :class="`pa-${layout.padX}`">
    <v-row no-gutters>
      <v-col cols="12"
        :xl="xlPanels">
        <v-row class="pr-4">
          <v-col v-if="item.PortraitController?.HasImage && !mobile && layout.showPortraits"
            cols="auto"
            class="d-flex flex-column">
            <cc-dialog icon="mdi-crop"
              color="primary"
              :title="$t('active.panelBase.setCombatImage')"
              :close-on-click="false"
              major
              max-width="90vw">
              <template #activator="{ open }">
                <div ref="portraitBox"
                  class="flex-grow-1"
                  role="button"
                  tabindex="0"
                  :title="$t('active.panelBase.combatImage')"
                  :aria-label="$t('active.panelBase.combatImage')"
                  style="position: relative; width: 155px; cursor: pointer"
                  @click="openCombatImageCrop(open)"
                  @keydown.enter="openCombatImageCrop(open)">
                  <svg v-if="combatImageCrop"
                    :viewBox="`${combatImageCrop.coordinates.left} ${combatImageCrop.coordinates.top} ${combatImageCrop.coordinates.width} ${combatImageCrop.coordinates.height}`"
                    preserveAspectRatio="xMidYMid slice"
                    style="position: absolute; inset: 0; width: 100%; height: 100%">
                    <image :href="combatImageCrop.image.src"
                      :width="combatImageCrop.image.width"
                      :height="combatImageCrop.image.height" />
                  </svg>
                  <cc-img v-else
                    width="155px"
                    height="100%"
                    color="panel"
                    cover
                    style="position: absolute; inset: 0"
                    :src="item.Portrait || ''" />
                </div>
              </template>
              <template #default="{ close }">
                <image-crop :src="item.Portrait || ''"
                  :aspect-ratio="combatImageAspect"
                  vertical-only
                  :confirm-label="$t('active.panelBase.setCombatImage')"
                  @hide="close"
                  @confirm="setCombatImageCrop($event, close)">
                  <template #actions>
                    <v-btn v-if="combatImageCrop"
                      variant="plain"
                      color="error"
                      prepend-icon="mdi-cancel"
                      @click="setCombatImageCrop(undefined, close)">
                      {{ $t('active.panelBase.clearCombatImage') }}
                    </v-btn>
                  </template>
                </image-crop>
              </template>
            </cc-dialog>
          </v-col>
          <v-col>
            <v-row no-gutters
              align="center">
              <v-col v-if="item.CombatController.StatController.SizeIcon"
                cols="auto"
                align-self="center"
                class="ml-n2 mr-2">
                <v-icon :icon="item.CombatController.StatController.SizeIcon"
                  size="60" />
              </v-col>
              <v-col>
                <slot name="name-block" />
              </v-col>
              <v-col v-if="!pcSheet && (!simple || multiActivation)"
                cols="auto"
                align-self="start"
                class="ml-auto mr-1 mt-1">
                <activation-tracker :item="item" />
                <v-menu v-if="!simple && (owner as any)[statusField]">
                  <template #activator="{ props: statusProps }">
                    <v-btn v-bind="statusProps"
                      size="x-small"
                      :color="getStatusColor()"
                      flat>
                      <span v-if="(owner as any)[statusField]">
                        {{ (owner as any)[statusField] }}
                      </span>
                    </v-btn>
                  </template>
                  <v-list density="compact">
                    <v-list-item v-for="s in statusOptions"
                      :key="s"
                      :title="s"
                      :active="(owner as any)[statusField] === s"
                      @click="applyStatus(s)" />
                  </v-list>
                </v-menu>
              </v-col>
            </v-row>

            <slot name="subtitle" />

            <timed-effect-panel :item="item" />

            <v-row class="mt-n1"
              dense>
              <v-col v-if="
                Object.keys(item.CombatController.StatController.MaxStats).includes('grit') ||
                ((item as any).Parent &&
                  Object.keys((item as any).Parent.StatController.MaxStats).includes('grit'))
              "
                cols="auto">
                <static-stat icon="mdi-star-four-points-outline"
                  :label="$t('active.panelBase.pilotGrit')"
                  :value="(item as any).Grit || (item as any).Parent?.Grit || 0" />
              </v-col>
              <template v-for="stat in <any[]>statColumns"
                :key="stat.key">
                <v-col v-if="stat.key === '__spacer__'"
                  cols="1" />
                <v-col v-else
                  cols="auto">
                  <static-stat :icon="stat.icon"
                    :label="stat.title"
                    :value="item.CombatController.StatController.MaxStats[stat.key] || 0" />
                  <cc-bonus :bonuses="getBonuses(stat.key)" />
                </v-col>
              </template>

              <v-col cols="auto">
                <static-stat v-if="item.ItemType === 'mech' || item.ItemType === 'pilot'"
                  icon="cc:weapon"
                  :label="$t('common.attackBonus')"
                  :value="(item as any).AttackBonus" />
                <cc-bonus :bonuses="getBonuses('attackBonus')" />
              </v-col>

              <v-col cols="auto">
                <cc-synergy-display location="stats"
                  :mech="item"
                  large />
              </v-col>
            </v-row>

            <active-effect-panel v-if="!simple && item.CombatController.ActiveEffects.length"
              :item="item" />

            <v-row v-if="!hidePalette"
              align="center"
              dense
              class="border-sm my-2"
              justify="space-evenly">
              <v-col>
                <slot name="action-palette" />
              </v-col>

              <v-col v-if="!simple"
                cols="auto"
                :class="mobile ? '' : 'ml-auto'"
                align-self="center">
                <cover-toggle :controller="item.CombatController" />
              </v-col>
            </v-row>

            <div class="mb-2">
              <component :is="trackableStatsComponent"
                :item="item">
                <template #dmg>
                  <damage-menu v-if="!simple && item.CombatController.StatController.MaxStats['hp']"
                    :encounter="encounterInstance.Encounter"
                    :controller="item.CombatController" />
                </template>
              </component>
              <custom-stat-editor :item="item" />
            </div>

            <slot name="stat-block" />
            <div v-if="!noActions && item.CombatController.StatController.MaxStats['activations']">
              <combat-action-panel :controller="item.CombatController"
                :hide-overcharge="item.ItemType !== 'mech'" />
            </div>
            <slot name="actions" />

            <div v-if="!noConditions"
              :class="`mt-${layout.padX * 2}`">
              <v-row v-if="!mobile"
                dense>
                <v-col cols="12"
                  md="4">
                  <damage-condition-selector :controller="item.CombatController" />
                </v-col>
                <v-col cols="12"
                  md="auto"
                  style="min-width: 20px" />
                <v-col class="mx-auto">
                  <status-condition-selector :controller="item.CombatController" />
                </v-col>
              </v-row>

              <v-expansion-panels v-else
                focusable
                tile
                color="panel"
                flat>
                <v-expansion-panel>
                  <v-expansion-panel-title class="heading h4">
                    {{ $t('active.panelBase.resistances') }}
                  </v-expansion-panel-title>
                  <v-expansion-panel-text style="border: 2px solid rgb(var(--v-theme-panel))">
                    <damage-condition-selector :controller="item.CombatController" />
                  </v-expansion-panel-text>
                </v-expansion-panel>
                <v-expansion-panel>
                  <v-expansion-panel-title class="heading h4">
                    {{ $t('active.panelBase.statusesConditions') }}
                  </v-expansion-panel-title>
                  <v-expansion-panel-text style="border: 2px solid rgb(var(--v-theme-panel))">
                    <status-condition-selector :controller="item.CombatController" />
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
            </div>
          </v-col>
        </v-row>

        <slot name="pre" />

        <div class="text-cc-overline mt-4 text-disabled">{{ $t('active.panelBase.counters') }}</div>
        <CCCounterSet :actor="item" />
      </v-col>
      <v-col cols="12"
        :xl="xlPanels">
        <slot />
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup lang="ts">
import { useEncounterContext } from './encounterContext'
import { computed, markRaw, ref } from 'vue'
import { useDisplay } from 'vuetify'
import ImageCrop from '@/ui/components/selectors/components/_ImageCrop.vue'
import { PilotStore } from '@/features/pilot_management/store'
import { NpcStore } from '@/features/gm/store/npc_store'
import { Mech } from '@/classes/mech/Mech'
import { Pilot } from '@/classes/pilot/Pilot'
import { Npc } from '@/classes/npc/Npc'
import CCCounterSet from '@/ui/components/items/features/counters/CCCounterSet.vue'
import DamageConditionSelector from './_components/DamageConditionSelector.vue'
import CombatActionPanel from './_components/CombatActionPanel.vue'
import StatusConditionSelector from './_components/StatusConditionSelector.vue'
import DamageMenu from './_components/DamageMenu.vue'
import CustomStatEditor from './_components/CustomStatEditor.vue'
import ActiveEffectPanel from './_components/ActiveEffectPanel.vue'
import TimedEffectPanel from './_components/TimedEffectPanel.vue'
import ActivationTracker from './_components/ActivationTracker.vue'
import CoverToggle from './_components/CoverToggle.vue'
import StaticStat from './_components/StaticStat.vue'
import TrackableStatsComplex from './_components/TrackableStatsComplex.vue'
import TrackableStatsSimple from './_components/TrackableStatsSimple.vue'
import { ICombatant } from '@/classes/components/combat/ICombatant'
import { PilotStatus, NpcStatus, MechStatus } from '@/classes/enums'
import { useLayoutOptions, filterStats } from '@/features/active_mode/layoutOptions'

const _TrackableStatsComplex = markRaw(TrackableStatsComplex)
const _TrackableStatsSimple = markRaw(TrackableStatsSimple)

const _display = useDisplay()

defineOptions({ name: 'EncounterPanelBase' })

const { encounterInstance, owner, simple, pcSheet } = useEncounterContext()
const multiActivation = computed(
  () => props.item.CombatController.StatController.MaxStats['activations'] > 1
)
const { layout } = useLayoutOptions()

const portraitBox = ref<HTMLElement>()
const combatImageAspect = ref(155 / 232)

function openCombatImageCrop(open: () => void) {
  const box = portraitBox.value
  if (box?.clientHeight) combatImageAspect.value = box.clientWidth / box.clientHeight
  open()
}
const combatImageCropTick = ref(0)
const combatImageCrop = computed(() => {
  if (combatImageCropTick.value < 0) return undefined
  const crop = props.item.PortraitController?.CombatImageCrop
  return crop?.image?.src === props.item.Portrait ? crop : undefined
})

function rosterOrigin(): Pilot | Mech | Npc | undefined {
  const item = props.item as unknown
  if (item instanceof Mech) {
    const pilot = PilotStore().getPilotByID(item.Pilot.OriginId || item.Pilot.ID) as Pilot | undefined
    return pilot?.Mechs.find(m => m.ID === item.ID)
  }
  if (item instanceof Pilot) return PilotStore().getPilotByID(item.OriginId || item.ID) as Pilot | undefined
  const originId = (item as { OriginId?: string }).OriginId
  return originId ? (NpcStore().getNpcByID(originId) as Npc | undefined) : undefined
}

function setCombatImageCrop(crop: unknown, close?: () => void) {
  if (!props.item.PortraitController) return
  props.item.PortraitController.CombatImageCrop = crop
  const origin = rosterOrigin()
  if (origin) {
    origin.PortraitController.CombatImageCrop = crop
    origin.SaveController.save()
  }
  combatImageCropTick.value++
  close?.()
}

const itemType = computed(() => props.item.ItemType.toLowerCase())
const statusField = computed<'status' | 'pilotStatus' | 'mechStatus'>(() => {
  if (itemType.value === 'mech') return 'mechStatus'
  if (itemType.value === 'pilot') return 'pilotStatus'
  return 'status'
})
const statusOptions = computed(() => {
  if (itemType.value === 'mech') {
    const opts = Object.values(MechStatus)
    return props.item.CombatController.HasAISystems
      ? opts
      : opts.filter(s => s !== MechStatus.Cascade)
  }
  if (itemType.value === 'pilot') return Object.values(PilotStatus)
  return Object.values(NpcStatus)
})

function applyStatus(s: string) {
  ; (owner.value as any)[statusField.value] = s
  const cc = props.item.CombatController
  if (statusField.value === 'mechStatus') {
    cc.SetDestroyed(s === MechStatus.Destroyed || s === MechStatus.ReactorMeltdown)
    cc.ReactorDestroyed = s === MechStatus.ReactorMeltdown
  } else if (statusField.value === 'pilotStatus') {
    cc.IsDead = s === PilotStatus.KIA
  } else {
    cc.SetDestroyed(s === NpcStatus.Destroyed)
  }
}

const props = withDefaults(
  defineProps<{
    item: ICombatant
    hidePalette?: boolean
    noStats?: boolean
    noActions?: boolean
    noConditions?: boolean
    onePanel?: boolean
  }>(),
  {
    hidePalette: false,
    noStats: false,
    noActions: false,
    noConditions: false,
    onePanel: false,
  }
)

const xlPanels = computed(() => {
  if (!layout.value.columns) return 12
  if (props.onePanel) return 12
  return 6
})
const extraStatSet = computed(() => {
  if (props.item.ItemType === 'mech') return []
  return ['attackBonus', 'grapple', 'ram']
})
const statColumns = computed(() => {
  const spacer = { key: '__spacer__' }
  const g1 = props.item.CombatController.StatController.GetStatCollection([
    'hull',
    'agi',
    'sys',
    'eng',
  ])
  const g2 = props.item.CombatController.StatController.GetStatCollection([
    'evasion',
    'edef',
    'techAttack',
    'sensorRange',
    'saveTarget',
  ])
  const g3 = props.item.CombatController.StatController.GetStatCollection(
    extraStatSet.value
  ).filter((x: any) => props.item.CombatController.StatController.MaxStats[x.key])
  const g4 = props.item.CombatController.StatController.CustomStats(props.item.ItemType)
  return [...filterStats([...g1, spacer, ...g2, ...g3], layout.value.coreStatsOnly), ...g4]
})
const mobile = computed(() => {
  return _display.mdAndDown.value
})
const trackableStatsComponent = computed(() =>
  layout.value.simpleTickbars ? _TrackableStatsSimple : _TrackableStatsComplex
)

function getBonuses(statKey) {
  if (statKey === 'agi') statKey = 'agility'
  if (statKey === 'sys') statKey = 'systems'
  if (statKey === 'eng') statKey = 'engineering'
  return props.item.CombatController.Bonuses.filter(b => b.ID === statKey)
}
function getStatusColor() {
  const status = (owner.value as any)[statusField.value]
  if (!status) return 'grey'
  if (itemType.value === 'mech') {
    switch (status) {
      case MechStatus.Operational:
        return 'success'
      case MechStatus.Cascade:
        return 'warning'
      default:
        return 'error'
    }
  } else if (itemType.value === 'pilot') {
    switch (status) {
      case PilotStatus.Active:
        return 'success'
      case PilotStatus.Injured:
        return 'warning'
      default:
        return 'error'
    }
  } else {
    switch (status) {
      case NpcStatus.Operational:
        return 'success'
      case NpcStatus.Routed:
      case NpcStatus.Disengaged:
        return 'warning'
      default:
        return 'error'
    }
  }
  return 'grey'
}
</script>

<style scoped>
@import './encounter-panels.css';
</style>
