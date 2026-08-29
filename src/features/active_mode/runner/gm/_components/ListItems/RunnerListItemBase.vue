<template>
  <div>
    <v-hover>
      <template #default="{ props, isHovering }">
        <v-tooltip location="right">
          <template #activator="{ props: tooltipProps }">
            <v-card v-bind="props"
              class="border-fade"
              :class="[`pa-${layout.padY}`, selected ? 'bg-panel' : '']"
              flat
              tile
              variant="outlined"
              :style="`border-color: ${selected ? 'rgb(var(--v-theme-accent))' : isHovering ? 'rgb(var(--v-theme-primary))' : 'rgb(var(--v-theme-panel))'};`"
              @click.stop="$emit('click', $event)">
              <v-row justify="space-between"
                dense
                :style="collapsed && !activations ? 'opacity: 0.4' : ''">
                <v-col v-if="!collapsed"
                  cols="auto">
                  <div :class="`bg-${side}`"
                    style="width: 4px; height: 100%" />
                </v-col>
                <v-col cols="auto"
                  v-bind="collapsed ? tooltipProps : {}"
                  style="position: relative">
                  <v-icon v-if="!collapsed && !noDrag"
                    icon="mdi-drag"
                    size="20"
                    :style="isHovering ? 'opacity: 1' : 'opacity: 0.4'"
                    class="handle"
                    style="
                  position: absolute;
                  top: 2px;
                  left: -6px;
                  cursor: move;
                  z-index: 2;
                  border-radius: 4px;
                " />
                  <v-img v-if="portrait && layout.showPortraits"
                    height="100%"
                    :width="`${size.portrait}px`"
                    cover
                    :src="portrait"
                    :style="destroyed ? 'opacity: 0.6' : ''" />
                  <v-avatar v-else
                    flat
                    tile
                    :size="size.portrait"
                    style="height: 100%"
                    :style="destroyed ? 'opacity: 0.6' : ''"
                    class="bg-panel">
                    <v-icon :icon="icon || 'mdi-cube'"
                      :size="size.portrait" />
                  </v-avatar>
                </v-col>
                <v-col v-if="!collapsed"
                  :class="`mx-${layout.padY}`">
                  <slot />

                  <div v-if="!destroyed && !reinforcementTurn && !isReinforcement"
                    :style="`font-size: ${size.font}px`">
                    <v-row dense
                      justify="space-between"
                      align="center"
                      class="pr-1">
                      <v-col v-for="stat in trackedStats"
                        :key="stat.key"
                        cols="auto">
                        <v-tooltip location="top"
                          open-delay="400">
                          <template #activator="{ props }">
                            <span v-bind="props"
                              class="text-no-wrap">
                              <v-icon v-if="layout.showIcon"
                                :size="size.statIcon"
                                class="mx-1 mt-n1"
                                :icon="stat.icon" />
                              <span v-if="layout.showLabel"
                                class="text-cc-overline text-disabled mr-1">{{ stat.title }}</span>
                              <b class="text-accent">{{
                                actor.StatController.CurrentStats[stat.key] }}</b>
                            </span>
                          </template>
                          <div class="text-cc-overline text-center">
                            {{ stat.title }}
                          </div>
                          <div class="heading h3 text-accent text-center">
                            {{ actor.StatController.CurrentStats[stat.key] }}
                            <span class="body-text text-text">
                              / {{ actor.StatController.MaxStats[stat.key] }}
                            </span>
                          </div>
                        </v-tooltip>
                      </v-col>
                    </v-row>
                    <v-divider :class="`my-${layout.padY}`" />
                    <v-row dense
                      justify="space-between"
                      align="center"
                      class="pl-2 pr-6">
                      <v-col v-for="stat in defenceStats"
                        :key="stat.key"
                        cols="auto">
                        <v-tooltip :text="stat.title"
                          location="top"
                          open-delay="400">
                          <template #activator="{ props }">
                            <span v-bind="props"
                              class="text-no-wrap">
                              <v-icon v-if="layout.showIcon"
                                :size="size.statIcon"
                                class="mx-1 mt-n1"
                                :icon="stat.icon" />
                              <span v-if="layout.showLabel"
                                class="text-cc-overline text-disabled mr-1">{{ stat.title }}</span>
                              <b class="text-secondary">
                                {{ actor.StatController.CurrentStats[stat.key] }}
                              </b>
                            </span>
                          </template>
                        </v-tooltip>
                      </v-col>
                    </v-row>
                  </div>

                  <div v-else-if="!destroyed && (reinforcementTurn || isReinforcement)">
                    <v-card flat
                      tile
                      class="text-center text-cc-overline mt-1">
                      <span v-if="timeToDeploy > 1"
                        class="fade-select">
                        {{ $t('active.runnerItem.deploysOnRound', { n: reinforcementTurn }) }}
                      </span>
                      <div v-else-if="timeToDeploy === 1"
                        class="bg-background pa-1 font-weight-bold text-accent">
                        {{ $t('active.runnerItem.deploysNextRound') }}
                      </div>
                    </v-card>

                    <div class="">
                      <cc-button v-if="!timeToDeploy || timeToDeploy < 1"
                        block
                        color="success"
                        size="x-small"
                        class="success-pulse mb-1"
                        prepend-icon="mdi-arrow-right-bold-box-outline"
                        @click="$emit('activate', actor)">
                        {{ $t('active.runnerItem.readyToDeploy') }}
                      </cc-button>
                      <v-btn v-else
                        block
                        flat
                        tile
                        color="success"
                        size="x-small"
                        class="mt-2 fade-select"
                        prepend-icon="mdi-arrow-right-bold-box-outline"
                        @click="$emit('activate', actor)">
                        {{ $t('active.runnerItem.forceDeploy') }}
                      </v-btn>
                    </div>
                  </div>

                  <v-row v-if="actor.CombatController.Resistances.length > 0"
                    :style="layout.showLabel ? '' : 'line-height: 0'"
                    no-gutters
                    justify="center"
                    class="text-center my-1">
                    <v-tooltip v-for="damage in actor.CombatController.Resistances"
                      :key="`${actor.CombatController.Resistances.length}_${damage.type}-${damage.condition}`"
                      location="top">
                      <template #activator="{ props }">
                        <div v-bind="props"
                          class="align-center resist-mark"
                          :class="layout.showLabel
                            ? 'd-flex resist-block my-1'
                            : 'd-inline-flex flex-column justify-center mr-4'">
                          <v-icon v-if="layout.showIcon"
                            :icon="`cc:${damage.type.toLowerCase()}`"
                            :class="[damageClass(damage), { 'mr-2': layout.showLabel }]"
                            style="border-bottom-right-radius: 5px" />
                          <span v-if="layout.showLabel"
                            class="text-cc-overline resist-label flex-grow-1 text-start"
                            :class="damageClass(damage)">
                            {{ typeLabel(damage.type) }} {{ conditionLabel(damage.condition) }}
                          </span>
                        </div>
                      </template>
                      <span class="text-cc-overline">
                        {{ $t('active.runnerItem.resistanceLine', { condition: damage.condition, type: damage.type }) }}
                      </span>
                    </v-tooltip>
                  </v-row>

                  <v-card v-if="destroyed"
                    height="16"
                    flat
                    tile
                    class="bg-stripes text-cc-overline text-center mt-1">
                    <v-chip style="height: 16px"
                      flat
                      tile
                      variant="elevated"
                      class="px-1">
                      <div v-if="actor.CombatController.ReactorDestroyed"
                        class="text-red"
                        style="margin-top: 2px">
                        <v-icon icon="mdi-radioactive-circle"
                          class="mt-n1" />
                        {{ $t('active.runnerItem.reactorDestroyed') }}
                      </div>
                      <div v-else
                        class="text-red"
                        style="margin-top: 2px">
                        <v-icon icon="cc:destroyed"
                          class="mt-n1" />
                        {{ $t('active.common.destroyed') }}
                      </div>
                    </v-chip>
                  </v-card>

                  <v-card v-else-if="actor.CombatController.IsInDangerZone"
                    height="16"
                    flat
                    tile
                    class="bg-stripes-dangerzone text-cc-overline text-center mt-1">
                    <v-chip style="height: 16px"
                      flat
                      tile
                      variant="elevated"
                      class="px-1">
                      <div class="text-red"
                        style="margin-top: 2px">
                        <v-icon icon="cc:heat" />
                        {{ $t('active.common.dangerZone') }}
                      </div>
                    </v-chip>
                  </v-card>

                  <v-row no-gutters
                    class="text-center">
                    <v-col v-if="actor.CombatController.Braced">
                      <v-tooltip location="top"
                        max-width="400px">
                        <template #activator="{ props }">
                          <v-card v-bind="props"
                            flat
                            tile
                            class="px-2 ma-1"
                            color="surface-variant">
                            <span class="text-cc-overline">{{ $t('active.actions.braced') }}</span>
                          </v-card>
                        </template>
                        <div class="heading h4">{{ $t('active.actions.braced') }}</div>
                        <v-divider class="my-1" />
                        {{ $t('active.runnerItem.bracedDesc') }}
                      </v-tooltip>
                    </v-col>

                    <v-col v-if="actor.CombatController.Overwatch">
                      <v-card flat
                        tile
                        class="px-2 ma-1"
                        color="surface-variant">
                        <span class="text-cc-overline">{{ $t('active.actions.overwatch') }}</span>
                      </v-card>
                    </v-col>

                    <v-col v-if="actor.CombatController.Prepared">
                      <v-card flat
                        tile
                        class="px-2 ma-1"
                        color="surface-variant">
                        <span class="text-cc-overline">{{ $t('active.common.prepared') }}</span>
                      </v-card>
                    </v-col>
                  </v-row>

                  <v-card v-if="actor.CombatController.Cover !== 'none'"
                    flat
                    tile
                    class="px-2 ma-1"
                    color="surface-variant">
                    <span class="text-cc-overline">
                      <v-icon v-if="actor.CombatController.Cover === 'soft'"
                        icon="mdi-gradient-vertical"
                        start
                        class="mt-n1" />
                      <v-icon v-else
                        icon="mdi-texture-box"
                        start
                        class="mt-n1" />
                      {{ $t('active.runnerItem.coverLabel', { cover: actor.CombatController.Cover }) }}
                    </span>
                  </v-card>

                  <div v-for="(cs, index) in customStatuses"
                    :key="`custom-${index}`"
                    class="d-flex">
                    <v-tooltip location="top"
                      max-width="400px">
                      <template #activator="{ props }">
                        <v-progress-linear v-bind="props"
                          model-value="100"
                          height="16"
                          color="exotic">
                          <v-chip class="text-cc-overline"
                            flat
                            tile>
                            <cc-slashes />
                            <span class="px-2">{{ cs.status.Attribute }}</span>
                            <cc-slashes />
                          </v-chip>
                        </v-progress-linear>
                      </template>
                      <div class="heading h4">
                        {{ cs.status.Attribute }}
                      </div>
                      {{ cs.status.Detail }}
                    </v-tooltip>

                    <div style="cursor: pointer"
                      class="mt-n1"
                      @click="actor.CombatController.RemoveCustomStatus(cs.status.Attribute)">
                      <v-icon icon="mdi-close"
                        size="22" />
                    </div>
                  </div>

                  <div v-for="status in actor.CombatController.Statuses"
                    :key="status.status.ID"
                    class="mb-1">
                    <v-progress-linear model-value="100"
                      height="16"
                      color="red-darken-3">
                      <v-chip class="text-cc-overline"
                        flat
                        tile>
                        <cc-slashes />
                        <v-icon :icon="status.status.Icon"
                          class="mx-2" />
                        <span class="pr-2">{{ status.status.Name }}</span>
                        <cc-slashes />
                      </v-chip>
                    </v-progress-linear>
                  </div>
                </v-col>

                <v-col v-if="!collapsed && !reinforcementTurn"
                  class="d-flex align-center"
                  style="padding-left: 2px; padding-right: 2px"
                  :class="destroyed ? 'bg-background' : activations > 0 ? 'bg-success-darken-2' : 'bg-grey'
                    "
                  cols="auto">
                  <div>
                    <v-tooltip location="bottom"
                      open-delay="400">
                      <template #activator="{ props }">
                        <v-icon v-if="destroyed"
                          icon="mdi-cancel"
                          size="20" />
                        <v-icon v-else-if="!activations"
                          icon="cc:activate"
                          size="20" />
                        <v-icon v-for="n in activations"
                          v-else
                          v-bind="props"
                          :key="`activation-${n}`"
                          icon="cc:activate"
                          size="20"
                          class="d-block" />
                      </template>
                      <span class="text-cc-overline">
                        {{ $t('active.runnerItem.activationsRemaining', { n: activations }) }}
                      </span>
                    </v-tooltip>
                  </div>
                </v-col>
              </v-row>
              <deployable-list-item v-for="d in deployed"
                :key="d.ID"
                :deployable="d"
                :collapsed="collapsed"
                @click="onDeployableClick($event, d)">
                {{ d.Name }}
              </deployable-list-item>
              <div v-if="collapsed"
                :class="`bg-${side}`"
                style="height: 4px" />
            </v-card>
          </template>
          {{ actor.Name }}
        </v-tooltip>
      </template>
    </v-hover>
  </div>
</template>

<script setup lang="ts">
import type { ICombatant } from '@/classes/components/combat/ICombatant'
import type { Status } from '@/classes/Status'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import DeployableListItem from './DeployableListItem.vue';
import { useLayoutOptions, filterStats } from '@/features/active_mode/layoutOptions';

const props = withDefaults(defineProps<{
  selected?: boolean
  collapsed?: boolean
  side?: string
  icon?: string
  portrait?: string
  statuses?: Status[]
  actor: ICombatant
  deployed?: any[]
  isReinforcement?: boolean
  reinforcementTurn?: number
  round?: number
  noDrag?: boolean
}>(), {
  selected: false,
  collapsed: false,
  side: 'neutral',
  icon: 'mdi-cube',
  portrait: '',
  statuses: () => [],
  deployed: () => [],
  isReinforcement: false,
  reinforcementTurn: 0,
  round: 1,
  noDrag: false
})

const emit = defineEmits<{
  'click': [payload: any]
  'deployable-click': [payload: any]
  'activate': [payload: any]
}>()

const { layout } = useLayoutOptions()

const ITEM_SIZES = {
  compact: { portrait: 56, statIcon: 14, font: 14 },
  default: { portrait: 80, statIcon: 18, font: 16 },
  comfortable: { portrait: 104, statIcon: 24, font: 18 },
}
const size = computed(() => ITEM_SIZES[layout.value.density])
const { t, te } = useI18n()

const trackedStats = computed(() =>
  filterStats(
    props.actor.StatController.GetStatCollection([
      'hp',
      'overshield',
      'stress',
      'heatcap',
      'structure',
      'repairCapacity',
    ]),
    layout.value.statSet
  )
)

const defenceStats = computed(() =>
  filterStats(
    props.actor.StatController.GetStatCollection(['armor', 'evasion', 'edef', 'saveTarget']),
    layout.value.statSet
  )
)

const activations = computed(() => {
      return props.actor.StatController.CurrentStats['activations'] || 0;
    })
const destroyed = computed(() => {
      return props.actor.CombatController.IsDestroyed;
    })
const customStatuses = computed(() => {
      return props.actor.CombatController.CustomStatuses || [];
    })
const timeToDeploy = computed(() => {
      return props.reinforcementTurn - props.round;
    })

function onDeployableClick(e, d) {
      if (e?.stopPropagation) e.stopPropagation()
      emit('deployable-click', d)
    }
function typeLabel(type: string) {
  const key = `enums.damageType.${type.toLowerCase()}`
  return te(key) ? t(key) : type
}

function conditionLabel(condition: string) {
  const key = `active.dmgCond.${condition === 'vulnerable' ? 'vulnerability' : condition}`
  return te(key) ? t(key) : condition
}

function damageClass(damage) {
      if (damage.condition === 'immunity') {
        return 'bg-exotic';
      } else if (damage.condition === 'resistance') {
        return `bg-success`;
      } else if (damage.condition === 'vulnerable') {
        return 'bg-error';
      }
      return '';
    }
</script>

<style scoped>
@import './runner-list-item.css';

.resist-label {
  line-height: 1.1;
  padding: 0 3px;
  border-bottom-right-radius: 5px;
}

.resist-block {
  flex: 0 0 100%;
}

.success-pulse {
  animation: success-pulse 2.8s infinite;
}

@keyframes success-pulse {
  0% {
    box-shadow: 0 0 0 0px rgb(var(--v-theme-success));
    border-radius: 0px;
  }

  100% {
    box-shadow: 0 0 0 8px rgba(0, 0, 0, 0);
    border-radius: 1px;
  }
}
</style>
