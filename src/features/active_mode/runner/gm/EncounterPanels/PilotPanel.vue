<template>
  <v-card flat tile class="pa-2">
    <v-row class="pr-4">
      <v-col cols="auto">
        <cc-img width="155px" height="100%" color="panel" cover :src="pilot.Portrait" />
      </v-col>
      <v-col>
        <v-row no-gutters>
          <v-col cols="auto" align-self="center" class="ml-n2 mr-2">
            <v-icon :icon="pilot.SizeIcon" size="60" />
          </v-col>
          <v-col cols="auto">
            <div class="heading h2">{{ pilot.Callsign }}</div>
            <div class="heading h4">
              {{ pilot.Name }}
            </div>
          </v-col>
          <v-col cols="auto" class="pt-3 pr-1">
            <cc-button
              v-for="i in pilot.CombatController.StatController.MaxStats['activations']"
              icon="cc:activate"
              size="x-large"
              variant="outlined"
              :color="
                pilot.CombatController.StatController.CurrentStats['activations'] >= i
                  ? 'green'
                  : 'grey'
              "
              @click="
                pilot.CombatController.StatController.CurrentStats['activations'] === 0
                  ? (pilot.CombatController.StatController.CurrentStats['activations'] += 1)
                  : (pilot.CombatController.StatController.CurrentStats['activations'] -= 1)
              "></cc-button>
          </v-col>
        </v-row>
        <v-row class="mt-n1">
          <v-col v-if="pilot.Grit" cols="auto">
            <v-tooltip location="top" text="Pilot Grit">
              <template #activator="{ props }">
                <span v-bind="props">
                  <v-icon icon="mdi-star-four-points-outline" size="x-large" class="mt-n2 mr-1" />
                  <span class="heading h2 text-accent">2</span>
                </span>
              </template>
            </v-tooltip>
          </v-col>
          <v-col
            cols="auto"
            v-for="(stat, index) in pilot.StatController.GetStatCollection([
              'evasion',
              'edef',
              'techattack',
              'sensorRange',
              'saveTarget',
            ])">
            <v-tooltip :text="stat.title" location="top" open-delay="400">
              <template #activator="{ props }">
                <v-icon v-bind="props" size="x-large" class="mt-n2 mr-1" :icon="stat.icon" />
                <span class="heading h2 text-accent">
                  {{ pilot.StatController.CurrentStats[stat.key] }}
                </span>
              </template>
            </v-tooltip>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <cc-tickbar
              v-model="pilot.StatController.CurrentStats['hp']"
              v-model:tertiary="overshield"
              primary-label="Hit Points"
              tertiary-label="Overshield"
              color="hp"
              tertiary-color="overshield"
              icon="mdi-heart-outline"
              tertiary-icon="mdi-hexagon-multiple-outline"
              :ticks="pilot.StatController.MaxStats['hp']" />
          </v-col>
          <v-col cols="auto">
            <stat-mini-panel
              title="armor"
              icon="mdi-shield-outline"
              color="armor"
              v-model="pilot.StatController.CurrentStats['armor']" />
          </v-col>
        </v-row>

        <v-row>
          <v-col align-self="center">
            <cc-tickbar
              v-model="pilot.StatController.CurrentStats['speed']"
              color="primary"
              min-width="150px"
              space
              icon="mdi-arrow-right-bold-hexagon-outline"
              class="mb-1"
              :ticks="pilot.StatController.MaxStats['speed']" />
          </v-col>
          <v-col cols="auto">
            <stat-mini-panel title="burn" icon="cc:burn" color="damage--burn" v-model="burn" />
          </v-col>
        </v-row>

        <combat-action-panel :controller="pilot.CombatController" />

        <v-row dense class="mt-4">
          <v-col cols="4">
            <damage-condition-selector :controller="pilot.CombatController" />
          </v-col>
          <v-col cols="auto" style="min-width: 20px" />
          <v-col class="mx-auto">
            <status-condition-selector :controller="pilot.CombatController" />
          </v-col>
        </v-row>

        <damage-menu
          :encounter="encounterInstance.Encounter"
          :controller="pilot.CombatController" />
      </v-col>
    </v-row>

    <div class="text-cc-overline mt-4 text-disabled">COUNTERS</div>
    <cc-counter-set :actor="pilot" />

    <v-divider class="my-4" />
    <slot />
  </v-card>
</template>

<script>
import _, { over } from 'lodash';
import { CompendiumStore } from '@/stores';
import StatMiniPanel from './_components/StatMiniPanel.vue';
import CombatActionPanel from './_components/CombatActionPanel.vue';
import DamageConditionSelector from './_components/DamageConditionSelector.vue';
import StatusConditionSelector from './_components/StatusConditionSelector.vue';
import DamageMenu from './_components/DamageMenu.vue';

export default {
  name: 'PcPanel',
  components: {
    StatMiniPanel,
    CombatActionPanel,
    DamageConditionSelector,
    StatusConditionSelector,
    DamageConditionSelector,
    DamageMenu,
  },
  props: {
    combatant: {
      type: Object,
      required: true,
    },
    encounterInstance: {
      type: Object,
      required: true,
    },
  },
  computed: {
    pilot() {
      return this.combatant.actor;
    },
  },
};
</script>
