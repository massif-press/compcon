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
      {{ item.ItemType }} DESTROYED
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
        xl="">
        <v-row class="pr-4">
          <v-col v-if="item.Portrait && !mobile"
            cols="auto">
            <cc-img width="155px"
              height="100%"
              color="panel"
              cover
              :src="item.Portrait" />
          </v-col>
          <v-col>
            <v-row no-gutters
              align="center">
              <v-col v-if="item.SizeIcon"
                cols="auto"
                align-self="center"
                class="ml-n2 mr-2">
                <v-icon :icon="item.SizeIcon"
                  size="60" />
              </v-col>
              <v-col>
                <slot name="name-block" />
              </v-col>
              <v-col cols="auto"
                align-self="start"
                class="ml-auto mr-1 mt-1">
                <v-menu>
                  <template #activator="{ props }">

                    <v-btn v-for="i in item.CombatController.StatController.MaxStats['activations']"
                      icon="cc:activate"
                      size="40"
                      flat
                      variant=outlined
                      class="mx-1"
                      :class="item.CombatController.StatController.CurrentStats['activations'] >= i ? 'bg-success' : ''"
                      style="corner-shape: bevel; border-radius: 10px 0px !important;"
                      :color="item.CombatController.StatController.CurrentStats['activations'] >= i
                        ? 'panel'
                        : 'grey'
                        "
                      v-bind="props"
                      </v-btn>
                  </template>
                  <v-card flat
                    tile
                    max-width="300"
                    class="pa-2 text-center"
                    border="sm">
                    <div>Mark an activation as complete?
                    </div>

                    <div class="text-cc-overline text-text mt-1 mb-2"
                      v-if="item.CombatController.StatController.CurrentStats['activations'] > 1">
                      This will reduce reduced the remaining activations
                      by 1 and
                      reset all actions.
                    </div>
                    <div v-else
                      class="text-cc-overline text-text mt-1 mb-2">
                      This will end {{ item.Name }}'s turn.
                    </div>
                    <v-btn block
                      flat
                      tile
                      size="small"
                      color="primary"
                      @click="handleActivate">
                      Confirm
                    </v-btn>
                  </v-card>
                </v-menu>
              </v-col>
            </v-row>

            <slot name="subtitle" />

            <timed-effect-panel :encounter="encounterInstance"
              :item="item" />

            <v-row class="mt-n1"
              dense>
              <v-col v-if="Object.keys(item.StatController.MaxStats).includes('grit')"
                cols="auto">
                <v-tooltip location="top"
                  text="Pilot Grit">
                  <template #activator="{ props }">
                    <span v-bind="props">
                      <v-icon icon="mdi-star-four-points-outline"
                        :size="mobile ? '20' : 'x-large'"
                        :class="mobile ? 'mr-1' : 'mt-n2 mr-1'" />
                      <span :class="mobile ? '' : 'h2'"
                        class="heading text-accent">
                        {{ item.Grit }}</span>
                    </span>
                  </template>
                </v-tooltip>
              </v-col>
              <v-col cols="auto"
                v-for="(stat, index) in item.StatController.GetStatCollection([
                  'hull',
                  'agi',
                  'sys',
                  'eng',
                ])">
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
                      {{ item.StatController.MaxStats[stat.key] }}
                    </span>
                  </template>
                </v-tooltip>
                <cc-bonus v-if="getBonus(stat.key)"
                  :bonus="getBonus(stat.key)"
                  icon />
              </v-col>
              <v-col cols="1" />
              <v-col cols="auto"
                v-for="(stat, index) in item.StatController.GetStatCollection([
                  'evasion',
                  'edef',
                  'techattack',
                  'sensorRange',
                  'saveTarget',
                ])">
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
                      {{ item.StatController.MaxStats[stat.key] }}
                    </span>
                  </template>
                </v-tooltip>
                <cc-bonus v-if="getBonus(stat.key)"
                  :bonus="getBonus(stat.key)"
                  icon />
              </v-col>
              <v-col cols="auto">
                <cc-synergy-display location="stats"
                  :mech="item"
                  large />
              </v-col>
            </v-row>


            <active-effect-panel v-if="item.CombatController.ActiveEffects.length"
              :encounter="encounterInstance"
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
                  class="text-cc-overline text-disabled">Cover</div>
                <v-btn-toggle v-model="item.CombatController.Cover"
                  flat
                  tile
                  color="primary"
                  style="height: 30px">
                  <v-btn size="small"
                    height="30"
                    value="none">{{ mobile ? 'None' : 'No Cover' }}</v-btn>
                  <v-btn size="small"
                    height="30"
                    value="soft">{{ mobile ? 'Soft' : 'Soft Cover' }}</v-btn>
                  <v-btn size="small"
                    height="30"
                    value="hard">{{ mobile ? 'Hard' : 'Hard Cover' }}</v-btn>
                </v-btn-toggle>
              </v-col>
            </v-row>

            <div class="mb-2">
              <trackable-stats-simple v-if="mobile || encounterInstance.SimpleTickbars"
                :item="item" />
              <trackable-stats-complex v-else
                :item="item" />
            </div>

            <!-- <div v-else>
              <v-row align="center">
                <v-col>
                  <div v-for="stat in orderedStats"
                    class="mb-3">
                    <div class="text-cc-overline">
                      <cc-slashes />
                      {{ stat.title }}
                    </div>
                    <cc-tickbar v-model="item.StatController.CurrentStats[stat.key]"
                      :color="stat.color"
                      :icon="stat.icon"
                      :ticks="item.StatController.MaxStats[stat.key]" />
                  </div>
                </v-col>


                <v-col cols="auto"
                  v-if="item.StatController.MaxStats['hp']">
                  <div style="display: flex; height: 100%"
                    class="py-3">
                    <div style="flex: 1; display: flex; flex-direction: column">
                      <stat-mini-panel title="armor"
                        icon="mdi-shield-outline"
                        color="armor"
                        v-model="item.StatController.CurrentStats['armor']" />
                      <div class="my-1" />
                      <stat-mini-panel title="overshield"
                        icon="mdi-hexagon-multiple-outline"
                        color="overshield"
                        v-model="item.StatController.CurrentStats['overshield']" />
                      <div class="my-1" />
                      <stat-mini-panel title="burn"
                        icon="cc:burn"
                        color="damage--burn"
                        v-model="item.StatController.CurrentStats['burn']" />
                    </div>
                  </div>
                </v-col>
              </v-row>
            </div> -->

            <custom-stat-editor :item="item" />

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
                  <status-condition-selector :controller="item.CombatController"
                    :encounter="encounterInstance" />
                </v-col>
              </v-row>

              <v-expansion-panels v-else
                focusable
                tile
                color="panel"
                flat>
                <v-expansion-panel>
                  <v-expansion-panel-title class="heading h4 ">Resistances</v-expansion-panel-title>
                  <v-expansion-panel-text style="border: 2px solid rgb(var(--v-theme-panel))">
                    <damage-condition-selector :controller="item.CombatController" />
                  </v-expansion-panel-text>
                </v-expansion-panel>
                <v-expansion-panel>
                  <v-expansion-panel-title
                    class="heading h4 ">Statuses/Conditions</v-expansion-panel-title>
                  <v-expansion-panel-text style="border: 2px solid rgb(var(--v-theme-panel))">
                    <status-condition-selector :controller="item.CombatController"
                      :encounter="encounterInstance" />
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
            </div>


            <damage-menu v-if="item.CombatController.StatController.MaxStats['hp']"
              :encounter="encounterInstance.Encounter"
              :controller="item.CombatController" />
          </v-col>
        </v-row>

        <slot name="pre" />

        <div class="text-cc-overline mt-4 text-disabled">COUNTERS</div>
        <cc-counter-set :actor="item" />
      </v-col>
      <v-col cols="12"
        xl="">
        <slot />
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import * as _ from 'lodash-es';
import { CompendiumStore } from '@/stores';
import StatMiniPanel from './_components/StatMiniPanel.vue';
import DamageConditionSelector from './_components/DamageConditionSelector.vue';
import CombatActionPanel from './_components/CombatActionPanel.vue';
import StatusConditionSelector from './_components/StatusConditionSelector.vue';
import DamageMenu from './_components/DamageMenu.vue';
import { Rules } from '@/class';
import CustomStatEditor from './_components/CustomStatEditor.vue';
import ActiveEffectPanel from './_components/ActiveEffectPanel.vue';
import TimedEffectPanel from './_components/TimedEffectPanel.vue';
import SimpleMiniPanel from './_components/SimpleMiniPanel.vue';
import TrackableStatsComplex from './_components/TrackableStatsComplex.vue';
import TrackableStatsSimple from './_components/TrackableStatsSimple.vue';

export default {
  name: 'EncounterPanelBase',
  components: {
    StatMiniPanel,
    SimpleMiniPanel,
    DamageConditionSelector,
    CombatActionPanel,
    StatusConditionSelector,
    DamageMenu,
    CustomStatEditor,
    ActiveEffectPanel,
    TimedEffectPanel,
    TrackableStatsComplex,
    TrackableStatsSimple,
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
    encounterInstance: {
      type: Object,
      required: true,
    },
    hidePalette: {
      type: Boolean,
      default: false,
    },
    noStats: {
      type: Boolean,
      default: false,
    },
    noActions: {
      type: Boolean,
      default: false,
    },
    noConditions: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    mobile() {
      return this.$vuetify.display.mdAndDown;
    },

    orderedStats() {
      const order = [
        'activations',
        'overshield',
        'hp',
        'structure',
        'overcharge',
        'stress',
        'speed',
        'repcap',
      ];

      const hide = ['activations', 'armor', 'burn', 'overshield'];

      if (!this.item.StatController.MaxStats['heatcap']) {
        hide.push('heatcap');
      }

      return this.item.StatController.TrackableStats.filter((s) => !hide.includes(s.key)).sort(
        (a, b) => order.indexOf(a.key) - order.indexOf(b.key)
      );
    },
  },
  methods: {


    getBonus(statKey) {
      if (statKey === 'agi') statKey = 'agility';
      if (statKey === 'sys') statKey = 'systems';
      if (statKey === 'eng') statKey = 'engineering';
      return this.item.CombatController.Bonuses.find((b) => b.ID === statKey);
    },

    handleActivate() {
      this.item.CombatController.EndTurn();
    },
  },
};
</script>

<style scoped>
.bg-stripes {
  background: repeating-linear-gradient(-45deg,
      rgba(249, 219, 78, 0.5),
      rgba(249, 219, 78, 0.5) 10px,
      rgba(100, 100, 100, 0.5) 10px,
      rgba(100, 100, 100, 0.5) 20px);
}
</style>
