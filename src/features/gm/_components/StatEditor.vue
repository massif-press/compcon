<template>
  <div class="px-2">
    <v-card flat tile class="pa-1">
      <v-row dense v-if="item.StatController.DisplayKeys.length">
        <v-col
          v-for="kvp in displayKeys.filter((x) => !hiddenKeys.includes(x.key))"
          v-show="kvp.key !== 'sizes'"
          :style="`min-width: ${mobile ? 'fit-content' : '12vw'}`"
        >
          <editable-attribute
            :readonly="readonly || !editing"
            :stat="kvp"
            :selections="item.StatController.StatSelections(kvp.key)"
            :val="item.StatController.MaxStats[kvp.key]"
            :deletable="!mandatoryStats.includes(kvp.key)"
            :bonuses="getBonuses(kvp.key)"
            @set="
              item.StatController.setMax(kvp.key, $event.value, $event.tier)
            "
            @remove="item.StatController.RemoveStat($event)"
          />
        </v-col>
      </v-row>
      <div v-else class="text-center text-disabled text-caption pa-2">
        <i>No stats to display</i>
      </div>
    </v-card>
    <v-row v-if="!readonly" dense class="mt-2 mb-1">
      <v-col cols="auto">
        <cc-button
          :color="editing ? 'success' : 'primary'"
          size="small"
          :prepend-icon="editing ? 'mdi-check' : 'mdi-pencil'"
          @click="editing = !editing"
        >
          {{ editing ? 'Done' : 'Edit' }}
        </cc-button>
      </v-col>

      <v-col cols="auto" class="ml-auto">
        <v-menu v-model="resetMenu" :close-on-content-click="false">
          <template v-slot:activator="{ props }">
            <cc-button
              v-bind="props"
              size="small"
              color="error"
              prepend-icon="mdi-undo-variant"
            >
              Reset
            </cc-button>
          </template>
          <v-card max-width="300px">
            <v-card-text>
              This will reset all stats to T{{ controller.Tier }}
              {{
                controller.Class ? controller.Class.Name : controller.Layer.Name
              }}
              default values. Are you sure?
            </v-card-text>
            <cc-button
              block
              size="small"
              class="px-4 mb-2"
              color="error"
              @click="
                controller.ResetStats();
                resetMenu = false;
              "
            >
              Confirm Reset Stats
            </cc-button>
          </v-card>
        </v-menu>
      </v-col>
      <v-spacer />
      <v-col cols="auto">
        <v-menu :close-on-content-click="false">
          <template v-slot:activator="{ props }">
            <cc-button
              v-bind="props"
              size="small"
              color="primary"
              prepend-icon="cc:compendium"
            >
              Add Stat
            </cc-button>
          </template>

          <v-card width="300px" flat tile border>
            <v-tabs
              v-model="menuTab"
              height="24"
              bg-color="primary"
              density="compact"
            >
              <v-tab>Core</v-tab>
              <v-tab>Custom</v-tab>
            </v-tabs>

            <v-card-text>
              <v-window v-model="menuTab">
                <v-window-item>
                  <v-select
                    v-model="statsToAdd"
                    :items="availableCoreStats"
                    item-value="key"
                    multiple
                    clearable
                    density="compact"
                    hide-details
                    chips
                  />
                  <cc-button
                    block
                    class="my-2"
                    color="primary"
                    size="small"
                    :disabled="!statsToAdd.length"
                    @click="addCoreStats()"
                  >
                    Add
                    <span v-if="statsToAdd.length"
                      >{{ statsToAdd.length }} Stat(s)</span
                    >
                  </cc-button>
                </v-window-item>
                <v-window-item>
                  <v-text-field
                    v-model="customTitle"
                    clearable
                    density="compact"
                    label="Stat Name"
                    hide-details
                  />
                  <cc-button
                    block
                    color="primary"
                    class="my-2"
                    size="small"
                    @click="addCustomStat()"
                  >
                    Add
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

<script lang="ts">
import {
  MandatoryStats,
  StatController,
} from '@/classes/components/combat/stats/StatController';
import EditableAttribute from './_subcomponents/EditableAttribute.vue';
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

export default {
  name: 'stat-editor',
  components: { EditableAttribute },
  props: {
    item: { type: Object, required: true },
    controller: { type: Object, required: true },
    bonuses: { type: Array, default: () => [] },
    prefix: { type: String, default: '' },
    readonly: { type: Boolean, default: false },
    tierOverride: { type: Number, default: 0 },
  },
  data: () => ({
    statsToAdd: [],
    menuTab: 0,
    customTitle: '',
    resetMenu: false,
    editing: false,
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
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
    coreStats() {
      return StatController.CoreStats;
    },
    availableCoreStats() {
      return StatController.CoreStats.filter(
        (x) =>
          !this.item.StatController.DisplayKeys.some((y) => y.key === x.key)
      ).filter((x) => x.key !== 'sizes');
    },
    displayKeys() {
      const omit = ['overshield', 'overcharge'];
      return this.item.StatController.DisplayKeys.filter(
        (x) => !omit.includes(x.key.toLowerCase())
      ).sort(
        (a, b) => npcStatOrder.indexOf(a.key) - npcStatOrder.indexOf(b.key)
      );
    },
    mandatoryStats() {
      return MandatoryStats;
    },
  },
  methods: {
    getBonuses(key: string) {
      return (this.bonuses as Bonus[]).filter((x) => x.ID.includes(key));
    },
    addCoreStats() {
      this.statsToAdd.forEach((x) => this.item.StatController.AddCoreStat(x));
      this.statsToAdd = [];
    },
    addCustomStat() {
      this.item.StatController.AddCustomStat(this.customTitle);
      this.customTitle = '';
    },
  },
};
</script>
