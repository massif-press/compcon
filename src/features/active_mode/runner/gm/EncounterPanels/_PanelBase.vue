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
    class="pa-2">
    <v-row no-gutters>
      <v-col cols="12"
        :xl="xlPanels">
        <v-row class="pr-4">
          <v-col v-if="item.PortraitController?.HasImage && !mobile"
            cols="auto">
            <cc-img width="155px"
              height="100%"
              color="panel"
              cover
              :src="item.Portrait || ''" />
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
              <v-col cols="auto"
                align-self="start"
                class="ml-auto mr-1 mt-1">
                <div class="text-center">
                  <v-menu>
                    <template #activator="{ props: activatorProps }">
                      <v-btn
                        v-for="i in item.CombatController.StatController.MaxStats['activations']"
                        :key="`activation-${i}`"
                        icon="cc:activate"
                        size="40"
                        flat
                        variant=outlined
                        class="mx-1"
                        :disabled="item.CombatController.StatController.CurrentStats['activations'] < i"
                        :class="item.CombatController.StatController.CurrentStats['activations'] >= i ? 'bg-success' : ''"
                        style="corner-shape: bevel; border-radius: 10px 0px !important;"
                        :color="item.CombatController.StatController.CurrentStats['activations'] >= i
                          ? 'panel'
                          : 'grey'
                          "
                        v-bind="activatorProps" />
                    </template>
                    <v-card flat
                      tile
                      max-width="300"
                      class="pa-2 text-center"
                      border="sm">
                      <div>{{ $t('active.panelBase.markActivation') }}
                      </div>

                      <div
                        v-if="item.CombatController.StatController.CurrentStats['activations'] > 1"
                        class="text-cc-overline text-text mt-1 mb-2">
                        {{ $t('active.panelBase.reduceActivations') }}
                      </div>
                      <div v-else
                        class="text-cc-overline text-text mt-1 mb-2">
                        {{ $t('active.panelBase.endTurn', { name: item.Name }) }}
                      </div>
                      <v-btn block
                        flat
                        tile
                        size="small"
                        color="primary"
                        @click="handleActivate">
                        {{ $t('common.confirm') }}
                      </v-btn>
                    </v-card>
                  </v-menu>
                </div>
                <v-menu>
                  <template #activator="{ props: statusProps }">
                    <v-btn v-bind="statusProps"
                      size="x-small"
                      :color="getStatusColor()"
                      flat>
                      <span v-if="(owner as any)[statusField]">{{ (owner as any)[statusField]
                        }}</span>
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
              <v-col
                v-if="Object.keys(item.CombatController.StatController.MaxStats).includes('grit') || ((item as any).Parent && Object.keys((item as any).Parent.StatController.MaxStats).includes('grit'))"
                cols="auto">
                <v-tooltip location="top"
                  :text="$t('active.tooltips.pilotGrit')">
                  <template #activator="{ props }">
                    <span v-bind="props">
                      <v-icon icon="mdi-star-four-points-outline"
                        :size="mobile ? '20' : 'x-large'"
                        :class="mobile ? 'mr-1' : 'mt-n2 mr-1'" />
                      <span :class="mobile ? '' : 'h2'"
                        class="heading text-accent">
                        {{ (item as any).Grit || (item as any).Parent?.Grit || 0 }}</span>
                    </span>
                  </template>
                </v-tooltip>
              </v-col>
              <template v-for="stat in <any[]>statColumns"
                :key="stat.key">
                <v-col v-if="stat.key === '__spacer__'"
                  cols="1" />
                <v-col v-else
                  cols="auto">
                  <v-tooltip :text="stat.title"
                    location="top"
                    open-delay="400">
                    <template #activator="{ props }">
                      <v-icon v-bind="props"
                        :icon="stat.icon"
                        :size="mobile ? '20' : 'x-large'"
                        :class="mobile ? 'mr-1' : 'mt-n2 mr-1'" />
                      <span :class="mobile ? '' : 'h2'"
                        class="heading text-accent">
                        {{ item.CombatController.StatController.MaxStats[stat.key] || 0 }}
                      </span>
                    </template>
                  </v-tooltip>
                  <cc-bonus :bonuses="getBonuses(stat.key)" />
                </v-col>
              </template>

              <v-col cols="auto">
                <v-tooltip v-if="item.ItemType === 'mech' || item.ItemType === 'pilot'"
                  :text="$t('common.attackBonus')"
                  location="top"
                  open-delay="400">
                  <template #activator="{ props }">
                    <v-icon v-bind="props"
                      icon="cc:weapon"
                      :size="mobile ? '20' : 'x-large'"
                      :class="mobile ? 'mr-1' : 'mt-n2 mr-1'" />
                    <span :class="mobile ? '' : 'h2'"
                      class="heading text-accent">
                      {{ (item as any).AttackBonus }}
                    </span>
                  </template>
                </v-tooltip>
                <cc-bonus :bonuses="getBonuses('attackBonus')" />
              </v-col>

              <v-col cols="auto">
                <cc-synergy-display location="stats"
                  :mech="item"
                  large />
              </v-col>
            </v-row>


            <active-effect-panel v-if="item.CombatController.ActiveEffects.length"
              :item="item" />

            <v-row v-if="!hidePalette"
              align="center"
              dense
              class="border-sm my-2"
              justify="space-evenly">
              <v-col>
                <slot name="action-palette" />
              </v-col>

              <v-col cols="auto"
                :class="mobile ? '' : 'ml-auto'"
                align-self="center">
                <div v-if="mobile"
                  class="text-cc-overline text-disabled">{{ $t('active.panelBase.cover') }}
                </div>
                <v-btn-toggle v-model="item.CombatController.Cover"
                  flat
                  tile
                  color="primary"
                  style="height: 30px">
                  <v-btn size="small"
                    height="30"
                    value="none">{{ mobile ? $t('common.none') :
                      $t('active.panelBase.noCover') }}</v-btn>
                  <v-btn size="small"
                    height="30"
                    value="soft">{{ mobile ? $t('active.panelBase.soft') :
                      $t('active.panelBase.softCover') }}</v-btn>
                  <v-btn size="small"
                    height="30"
                    value="hard">{{ mobile ? $t('active.panelBase.hard') :
                      $t('active.panelBase.hardCover') }}</v-btn>
                </v-btn-toggle>
              </v-col>
            </v-row>

            <div class="mb-2">

              <component :is="trackableStatsComponent"
                :item="item">
                <template #dmg>
                  <damage-menu v-if="item.CombatController.StatController.MaxStats['hp']"
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
              class="mt-4">
              <v-row v-if="!mobile"
                dense>
                <v-col cols="12"
                  md=4>
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
                  <v-expansion-panel-title class="heading h4 ">{{ $t('active.panelBase.resistances')
                    }}</v-expansion-panel-title>
                  <v-expansion-panel-text style="border: 2px solid rgb(var(--v-theme-panel))">
                    <damage-condition-selector :controller="item.CombatController" />
                  </v-expansion-panel-text>
                </v-expansion-panel>
                <v-expansion-panel>
                  <v-expansion-panel-title class="heading h4 ">{{
                    $t('active.panelBase.statusesConditions')
                    }}</v-expansion-panel-title>
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
import { computed, markRaw } from 'vue'
import { useDisplay } from 'vuetify'
import CCCounterSet from '@/ui/components/items/features/counters/CCCounterSet.vue'
import DamageConditionSelector from './_components/DamageConditionSelector.vue';
import CombatActionPanel from './_components/CombatActionPanel.vue';
import StatusConditionSelector from './_components/StatusConditionSelector.vue';
import DamageMenu from './_components/DamageMenu.vue';
import CustomStatEditor from './_components/CustomStatEditor.vue';
import ActiveEffectPanel from './_components/ActiveEffectPanel.vue';
import TimedEffectPanel from './_components/TimedEffectPanel.vue';
import TrackableStatsComplex from './_components/TrackableStatsComplex.vue';
import TrackableStatsSimple from './_components/TrackableStatsSimple.vue';
import { ICombatant } from '@/classes/components/combat/ICombatant'
import { PilotStatus, NpcStatus, MechStatus } from '@/classes/enums'

const _TrackableStatsComplex = markRaw(TrackableStatsComplex)
const _TrackableStatsSimple = markRaw(TrackableStatsSimple)

const _display = useDisplay()

defineOptions({ name: 'EncounterPanelBase' })

const { encounterInstance, owner } = useEncounterContext()

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

const props = withDefaults(defineProps<{
  item: ICombatant
  hidePalette?: boolean
  noStats?: boolean
  noActions?: boolean
  noConditions?: boolean
  onePanel?: boolean
}>(), {
  hidePalette: false,
  noStats: false,
  noActions: false,
  noConditions: false,
  onePanel: false
})

const xlPanels = computed(() => {
  if (!encounterInstance.value.LayoutColumns) return 12;
  if (props.onePanel) return 12;
  if (mobile.value) return 12;
  return 6
})
const extraStatSet = computed(() => {
  if (props.item.ItemType === 'mech') return []
  return ['attackBonus', 'grapple', 'ram']
})
const statColumns = computed(() => {
  const spacer = { key: '__spacer__' }
  const g1 = props.item.CombatController.StatController.GetStatCollection(['hull', 'agi', 'sys', 'eng'])
  const g2 = props.item.CombatController.StatController.GetStatCollection(['evasion', 'edef', 'techAttack', 'sensorRange', 'saveTarget'])
  const g3 = props.item.CombatController.StatController.GetStatCollection(extraStatSet.value).filter((x: any) => props.item.CombatController.StatController.MaxStats[x.key])
  const g4 = props.item.CombatController.StatController.CustomStats(props.item.ItemType)
  return [...g1, spacer, ...g2, ...g3, ...g4]
})
const mobile = computed(() => {
  return _display.mdAndDown.value;
})
const trackableStatsComponent = computed(() => {
  if (!encounterInstance.value.ForceComplexTickbars && (mobile.value || encounterInstance.value.SimpleTickbars)) {
    return _TrackableStatsSimple;
  } else {
    return _TrackableStatsComplex;
  }
})

function getBonuses(statKey) {
  if (statKey === 'agi') statKey = 'agility';
  if (statKey === 'sys') statKey = 'systems';
  if (statKey === 'eng') statKey = 'engineering';
  return props.item.CombatController.Bonuses.filter((b) => b.ID === statKey);
}
function handleActivate() {
  props.item.CombatController.EndTurn();
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
