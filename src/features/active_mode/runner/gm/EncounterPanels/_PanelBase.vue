<template>
  <slot name="header" />
  <cc-alert v-if="item.CombatController.IsDestroyed" class="ma-2" color="error" prominent outlined>
    <v-icon icon="cc:destroyed" size="large" start />
    <span class="text-cc-overline">{{ item.ItemType }} DESTROYED</span>
  </cc-alert>
  <v-card flat tile class="pa-2">
    <v-row class="pr-4">
      <v-col v-if="item.Portrait" cols="auto">
        <cc-img width="155px" height="100%" color="panel" cover :src="item.Portrait" />
      </v-col>
      <v-col>
        <v-row no-gutters align="center">
          <v-col v-if="item.SizeIcon" cols="auto" align-self="center" class="ml-n2 mr-2">
            <v-icon :icon="item.SizeIcon" size="60" />
          </v-col>
          <v-col>
            <slot name="name-block" />
          </v-col>
          <v-col cols="auto" class="ml-auto mr-1 mt-1">
            <cc-button
              v-for="i in item.CombatController.StatController.MaxStats['activations']"
              icon="cc:activate"
              size="x-large"
              variant="outlined"
              :color="
                item.CombatController.StatController.CurrentStats['activations'] >= i
                  ? 'green'
                  : 'grey'
              "
              @click="
                item.CombatController.StatController.CurrentStats['activations'] === 0
                  ? (item.CombatController.StatController.CurrentStats['activations'] += 1)
                  : (item.CombatController.StatController.CurrentStats['activations'] -= 1)
              "></cc-button>
          </v-col>
        </v-row>

        <slot name="subtitle" />

        <v-row class="mt-n1">
          <v-col v-if="item.Grit" cols="auto">
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
            v-for="(stat, index) in item.StatController.GetStatCollection([
              'hull',
              'agi',
              'sys',
              'eng',
            ])">
            <v-tooltip :text="stat.title" location="top" open-delay="400">
              <template #activator="{ props }">
                <v-icon v-bind="props" size="x-large" class="mt-n2 mr-1" :icon="stat.icon" />
                <span class="heading h2 text-accent">
                  {{ item.StatController.MaxStats[stat.key] }}
                </span>
              </template>
            </v-tooltip>
          </v-col>
          <v-col cols="1" />
          <v-col
            cols="auto"
            v-for="(stat, index) in item.StatController.GetStatCollection([
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
                  {{ item.StatController.MaxStats[stat.key] }}
                </span>
              </template>
            </v-tooltip>
          </v-col>
        </v-row>

        <v-row
          v-if="!hidePalette"
          align="center"
          dense
          class="border-sm mt-4 mb-2"
          justify="space-evenly">
          <v-col>
            <slot name="action-palette" />
          </v-col>

          <v-col cols="auto" class="ml-auto" align-self="center">
            <v-btn-toggle
              v-model="item.CombatController.Cover"
              flat
              tile
              direction="vertical"
              color="primary"
              density="compact">
              <v-btn size="small" value="none">No Cover</v-btn>
              <v-btn size="small" value="soft">Soft Cover</v-btn>
              <v-btn size="small" value="hard">Hard Cover</v-btn>
            </v-btn-toggle>
          </v-col>
        </v-row>

        <div v-if="!noStats">
          <v-row>
            <v-col>
              <cc-tickbar
                v-model="item.StatController.CurrentStats['hp']"
                v-model:secondary="item.StatController.CurrentStats['structure']"
                v-model:tertiary="item.StatController.CurrentStats['overshield']"
                primary-label="Hit Points"
                :secondary-label="item.StatController.MaxStats['structure'] && 'Structure'"
                tertiary-label="Overshield"
                color="hp"
                secondary-color="structure"
                tertiary-color="overshield"
                icon="mdi-heart-outline"
                secondary-icon="cc:structure"
                tertiary-icon="mdi-hexagon-multiple-outline"
                :ticks="item.StatController.MaxStats['hp']"
                :secondary-ticks="item.StatController.MaxStats['structure']"
                editable />
            </v-col>
            <v-col cols="auto">
              <stat-mini-panel
                title="armor"
                icon="mdi-shield-outline"
                color="armor"
                :base-value="item.StatController.MaxStats['armor']"
                v-model.number="item.StatController.CurrentStats['armor']" />
            </v-col>
          </v-row>

          <v-row>
            <v-col>
              <cc-tickbar
                v-model="item.StatController.CurrentStats['heatcap']"
                v-model:secondary="item.StatController.CurrentStats['stress']"
                v-model:tertiary="item.StatController.CurrentStats['overcharge']"
                :value-atlas="overchargeTrack"
                :secondary-label="item.StatController.MaxStats['stress'] && 'Reactor Stress'"
                :tertiary-label="item.ItemType === 'mech' && 'Overcharge'"
                :color="item.CombatController.IsInDangerZone ? 'dangerzone' : 'heat'"
                secondary-color="stress"
                tertiary-color="overcharge"
                icon="cc:heat"
                secondary-icon="cc:reactor"
                tertiary-icon="mdi-decagram-outline"
                :ticks="item.StatController.MaxStats['heatcap']"
                :secondary-ticks="item.StatController.MaxStats['stress']"
                :tertiary-ticks="3"></cc-tickbar>
            </v-col>
            <v-col cols="auto">
              <stat-mini-panel
                title="burn"
                icon="cc:burn"
                color="damage--burn"
                v-model.number="item.StatController.CurrentStats['burn']" />
            </v-col>
          </v-row>
          <v-row class="mb-3">
            <v-col>
              <cc-tickbar
                v-if="item.StatController.MaxStats['speed']"
                v-model="item.StatController.CurrentStats['speed']"
                color="primary"
                min-width="150px"
                space
                icon="mdi-arrow-right-bold-hexagon-outline"
                class="mb-1"
                :ticks="item.StatController.MaxStats['speed']" />
              <cc-tickbar
                v-if="item.StatController.MaxStats['repairCapacity']"
                v-model="item.StatController.CurrentStats['repairCapacity']"
                color="success"
                icon="cc:repair"
                min-width="150px"
                space
                reverse
                :ticks="item.StatController.MaxStats['repairCapacity']" />
            </v-col>
            <v-col cols="auto" v-if="item.ItemType === 'mech'">
              <stat-mini-panel
                v-model="corepower"
                title="core"
                :icon="currentIcon"
                :color="corepower ? 'core' : 'grey'"
                @click="drainBattery"
                boolean />
            </v-col>
          </v-row>
        </div>

        <div v-else>
          <v-row align="center">
            <v-col>
              <div v-for="stat in orderedStats" class="mb-3">
                <div class="text-cc-overline">
                  <cc-slashes />
                  {{ stat.title }}
                </div>
                <cc-tickbar
                  v-model="item.StatController.CurrentStats[stat.key]"
                  :color="stat.color"
                  :icon="stat.icon"
                  :ticks="item.StatController.MaxStats[stat.key]" />
              </div>
            </v-col>
            <v-col cols="auto" v-if="item.StatController.MaxStats['hp']">
              <div style="display: flex; height: 100%" class="py-3">
                <div style="flex: 1; display: flex; flex-direction: column">
                  <stat-mini-panel
                    title="armor"
                    icon="mdi-shield-outline"
                    color="armor"
                    v-model="item.StatController.CurrentStats['armor']" />
                  <div class="my-1" />
                  <stat-mini-panel
                    title="overshield"
                    icon="mdi-hexagon-multiple-outline"
                    color="overshield"
                    v-model="item.StatController.CurrentStats['overshield']" />
                  <div class="my-1" />
                  <stat-mini-panel
                    title="burn"
                    icon="cc:burn"
                    color="damage--burn"
                    v-model="item.StatController.CurrentStats['burn']" />
                </div>
              </div>
            </v-col>
          </v-row>
        </div>

        <custom-stat-editor :item="item" />

        <slot name="stat-block" />

        <combat-action-panel
          v-if="!noActions && item.CombatController.StatController.MaxStats['activations']"
          :controller="item.CombatController"
          :hide-overcharge="item.ItemType !== 'mech'" />

        <v-row v-if="!noConditions" dense class="mt-4">
          <v-col cols="4">
            <damage-condition-selector :controller="item.CombatController" />
          </v-col>
          <v-col cols="auto" style="min-width: 20px" />
          <v-col class="mx-auto">
            <status-condition-selector :controller="item.CombatController" />
          </v-col>
        </v-row>

        <damage-menu
          v-if="item.CombatController.StatController.MaxStats['hp']"
          :encounter="encounterInstance.Encounter"
          :controller="item.CombatController" />
      </v-col>
    </v-row>

    <special-status-display :controller="item.CombatController" />

    <slot name="pre" />

    <div class="text-cc-overline mt-4 text-disabled">COUNTERS</div>
    <cc-counter-set :actor="item" />

    <slot />
  </v-card>
</template>

<script>
import _ from 'lodash';
import { CompendiumStore } from '@/stores';
import StatMiniPanel from './_components/StatMiniPanel.vue';
import DamageConditionSelector from './_components/DamageConditionSelector.vue';
import CombatActionPanel from './_components/CombatActionPanel.vue';
import SpecialStatusDisplay from './_components/SpecialStatusDisplay.vue';
import StatusConditionSelector from './_components/StatusConditionSelector.vue';
import DamageMenu from './_components/DamageMenu.vue';
import { Rules } from '@/class';
import CustomStatEditor from './_components/CustomStatEditor.vue';

export default {
  name: 'EncounterPanelBase',
  components: {
    StatMiniPanel,
    DamageConditionSelector,
    CombatActionPanel,
    SpecialStatusDisplay,
    StatusConditionSelector,
    DamageMenu,
    CustomStatEditor,
  },
  data() {
    return {
      corepower: true,
      batteryIcons: [
        'mdi-battery-outline',
        'mdi-battery-low',
        'mdi-battery-medium',
        'mdi-battery-high',
      ],
      index: 3,
    };
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
    currentIcon() {
      return this.batteryIcons[this.index];
    },
    overchargeTrack() {
      return this.item.OverchangeTrack ? this.item.OverchangeTrack : Rules.Overcharge;
    },
    orderedStats() {
      const order = [
        'activations',
        'overshield',
        'hp',
        'structure',
        'overcharge',
        'heatcap',
        'stress',
        'speed',
        'repcap',
      ];
      const hide = ['activations', 'armor', 'burn', 'overshield'];

      return this.item.StatController.TrackableStats.filter((s) => !hide.includes(s.key)).sort(
        (a, b) => order.indexOf(a.key) - order.indexOf(b.key)
      );
    },
  },
  methods: {
    getIcon(stat) {
      const icons = {
        structure: 'cc:structure',
        armor: 'mdi-shield-outline',
        hp: 'mdi-heart-outline',
        reactor: 'cc:reactor',
        heat: 'cc:heat',
        repair: 'cc:repair',
        techattack: 'cc:tech_quick',
      };
      return icons[stat];
    },

    drainBattery() {
      if (this.index > 0) {
        this.corepower = false;
        const interval = setInterval(() => {
          this.index--;
          if (this.index === 0) clearInterval(interval);
        }, 60);
      } else {
        this.corepower = true;
        this.index = 3;
      }
    },
  },
};
</script>
