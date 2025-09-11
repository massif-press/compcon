<template>
  <div class="px-2">
    <v-row dense class="mt-2 mb-1">
      <v-spacer />
      <v-col cols="auto">
        <v-menu :close-on-content-click="false">
          <template v-slot:activator="{ props }">
            <cc-button v-bind="props" size="small" color="primary" prepend-icon="cc:compendium">
              Edit Stats
            </cc-button>
          </template>

          <v-card width="300px" flat tile border>
            <v-tabs v-model="menuTab" height="24" bg-color="primary" density="compact">
              <v-tab>Trackable</v-tab>
              <v-tab>Static</v-tab>
            </v-tabs>

            <v-card-text>
              <v-window v-model="menuTab">
                <v-window-item>
                  <v-select
                    v-model="trackableStat"
                    :items="availableTrackableStats"
                    item-value="key"
                    density="compact"
                    hide-details
                    class="mb-2"
                    chips />
                  <v-text-field
                    v-model.number="trackableValue"
                    clearable
                    density="compact"
                    label="Stat Value"
                    hide-details />
                  <cc-button
                    block
                    class="my-2"
                    :color="hasStat(trackableStat && trackableStat.title) ? 'success' : 'primary'"
                    size="small"
                    :disabled="!trackableStat"
                    @click="addTrackableStat()">
                    {{ hasStat(trackableStat && trackableStat.title) ? 'Save' : 'Add' }}
                  </cc-button>
                  <cc-button
                    v-if="
                      trackableStat &&
                      isCoreStat(trackableStat.title) &&
                      hasStat(trackableStat.title)
                    "
                    block
                    class="my-2"
                    color="error"
                    size="x-small"
                    @click="removeStat(trackableStat.title)">
                    Remove Stat
                  </cc-button>
                </v-window-item>

                <v-window-item>
                  <v-select
                    v-model="staticStat"
                    :items="availableStaticStats"
                    item-value="key"
                    density="compact"
                    hide-details
                    class="mb-2"
                    chips />
                  <v-text-field
                    v-model.number="staticValue"
                    clearable
                    density="compact"
                    label="Stat Value"
                    hide-details />
                  <cc-button
                    block
                    class="my-2"
                    :color="hasStat(staticStat || '') ? 'success' : 'primary'"
                    size="small"
                    :disabled="!staticStat"
                    @click="addStaticStat()">
                    {{ hasStat(staticStat || '') ? 'Save' : 'Add' }}
                  </cc-button>
                  <cc-button
                    v-if="staticStat && isCoreStat(staticStat) && hasStat(staticStat)"
                    block
                    class="my-2"
                    color="error"
                    size="x-small"
                    @click="removeStat(staticStat)">
                    Remove Stat
                  </cc-button>
                </v-window-item>
              </v-window>
            </v-card-text>
          </v-card>
        </v-menu>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { MandatoryStats, StatController } from '@/classes/components/combat/stats/StatController';
import { Bonus } from '@/classes/components';

const npcStatOrder = [
  'hull',
  'agi',
  'sys',
  'eng',
  'size',
  'sizes',
  'activations',
  'structure',
  'stress',
  'hp',
  'speed',
  'sensorRange',
  'heat',
  'armor',
  'evasion',
  'edef',
  'attackBonus',
  'techAttack',
  'saveTarget',
  'grapple',
  'ram',
];

const trackable = [
  { title: 'HP', key: 'hp' },
  { title: 'Reactor', key: 'stress' },
  { title: 'Heat Capacity', key: 'heatcap' },
  { title: 'Structure', key: 'structure' },
  { title: 'Repair Capacity', key: 'repairCapacity' },
  { title: 'Overcharge', key: 'overcharge' },
  { title: 'Activations', key: 'activations' },
  { title: 'Speed', key: 'speed' },
];

const statics = [
  { title: 'Hull', key: 'hull' },
  { title: 'Agility', key: 'agi' },
  { title: 'Systems', key: 'sys' },
  { title: 'Engineering', key: 'eng' },
  { title: 'Size', key: 'size' },
  { title: 'Sensor Range', key: 'sensorRange' },
  { title: 'Evasion', key: 'evasion' },
  { title: 'E-Defense', key: 'edef' },
  { title: 'Attack Bonus', key: 'attackBonus' },
  { title: 'Tech Attack', key: 'techAttack' },
  { title: 'Save Target', key: 'saveTarget' },
  { title: 'Grapple', key: 'grapple' },
  { title: 'Ram', key: 'ram' },
];

export default {
  name: 'stat-editor',
  props: {
    item: { type: Object, required: true },
    bonuses: { type: Array, default: () => [] },
    allowCore: { type: Boolean, default: false },
  },
  data: () => ({
    trackableStat: undefined,
    trackableValue: 0,
    staticStat: undefined,
    staticValue: 0,

    menuTab: 0,

    hiddenKeys: [
      'overcharge',
      'overshield',
      'attackbonus',
      'limitedBonus',
      'heatcap',
      'repairCapacity',
      'saveBonus',
    ],
  }),
  computed: {
    controller() {
      return this.item.StatController;
    },
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
    coreStats() {
      return StatController.CoreStats;
    },
    availableCoreStats() {
      return StatController.CoreStats.filter((x) => x.key !== 'sizes');
    },
    displayKeys() {
      const omit = ['overshield', 'overcharge', 'burn'];
      return this.item.StatController.DisplayKeys.filter(
        (x) => !omit.includes(x.key.toLowerCase())
      ).sort((a, b) => npcStatOrder.indexOf(a.key) - npcStatOrder.indexOf(b.key));
    },
    mandatoryStats() {
      return MandatoryStats;
    },
    customStats() {
      return Object.keys(this.item.StatController.MaxStats).filter(
        (x) => !this.mandatoryStats.includes(x) && !this.hiddenKeys.includes(x.toLowerCase())
      );
    },
    hasStat() {
      return (key) => Object.keys(this.item.StatController.MaxStats).includes(key);
    },
    availableTrackableStats() {
      return this.allowCore ? trackable : trackable.filter((x) => !this.isCoreStat(x.title));
    },
    availableStaticStats() {
      return this.allowCore ? statics : statics.filter((x) => !this.isCoreStat(x.title));
    },
  },
  methods: {
    isCoreStat(key) {
      return this.coreStats.map((x) => x.key).includes(key);
    },
    addTrackableStat() {
      if (!this.trackableStat) return;
      console.log(this.trackableStat, this.trackableValue);
      this.item.StatController.MaxStats[this.trackableStat] = Number(this.trackableValue) || 0;
      this.trackableStat = undefined;
      this.trackableValue = 0;
    },
    addStaticStat() {
      if (!this.staticStat) return;
      console.log(this.staticStat, this.staticValue);
      this.item.StatController.MaxStats[this.staticStat] = Number(this.staticValue) || 0;
      console.log(this.item.StatController.MaxStats);
      this.staticStat = undefined;
      this.staticValue = 0;
    },
    removeStat() {
      if (!this.hasStat(key)) return;
      delete this.item.StatController.MaxStats[key];
    },
  },
};
</script>
