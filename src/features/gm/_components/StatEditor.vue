<template>
  <div class="text-overline pt-2">{{ prefix }} STATS</div>
  <div class="px-2">
    <v-card variant="outlined" class="pa-1" style="border-color: rgb(var(--v-theme-panel))">
      <v-row dense v-if="item.StatController.DisplayKeys.length">
        <v-col
          v-for="kvp in item.StatController.DisplayKeys"
          v-show="kvp.key !== 'sizes'"
          style="min-width: 10vw">
          <editable-attribute
            v-if="kvp.key !== 'sizes'"
            :readonly="readonly"
            :stat="kvp"
            :selections="item.StatController.StatSelections(kvp.key)"
            :val="item.StatController.MaxStats[kvp.key]"
            :deletable="!item.MandatoryStats.includes(kvp.key)"
            :bonuses="getBonuses(kvp.key)"
            @set="item.StatController.setMax(kvp.key, $event.value, $event.tier)"
            @remove="item.StatController.RemoveStat($event)" />
        </v-col>
      </v-row>
      <div v-else class="text-center text-disabled text-caption pa-2">
        <i>No stats to display</i>
      </div>
    </v-card>
    <v-row v-if="!readonly" dense class="mt-2 mb-1">
      <v-col cols="auto">
        <v-menu v-model="coreMenu" :close-on-content-click="false">
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" color="accent" variant="tonal" class="mr-2"
              ><v-icon start icon="cc:compendium" />Add Core Stat
            </v-btn>
          </template>
          <v-card style="min-width: 30vw">
            <v-card-text>
              <v-select
                v-model="statsToAdd"
                :items="availableCoreStats"
                item-value="key"
                multiple
                clearable
                density="compact"
                hide-details
                chips />
            </v-card-text>
            <v-divider />
            <v-card-actions>
              <v-spacer />
              <v-btn variant="tonal" color="accent" size="small" @click="addCoreStats()">Add</v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-col>
      <v-col cols="auto">
        <v-menu v-model="customMenu" :close-on-content-click="false">
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" color="secondary" variant="tonal"
              ><v-icon start icon="mdi-flask" />Add Custom Stat
            </v-btn>
          </template>
          <v-card style="min-width: 20vw">
            <v-card-text>
              <v-text-field
                v-model="customTitle"
                clearable
                density="compact"
                label="Stat Name"
                hide-details />
            </v-card-text>
            <v-divider />
            <v-card-actions>
              <v-spacer />
              <v-btn variant="tonal" color="accent" size="small" @click="addCustomStat()"
                >Add</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-col>
      <v-col cols="auto" class="ml-auto">
        <v-menu v-model="resetMenu" :close-on-content-click="false">
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              color="error"
              size="x-small"
              variant="outlined"
              class="fade-select"
              >Reset Stats
            </v-btn>
          </template>
          <v-card style="min-width: 30vw">
            <v-card-text>
              This will reset all stats to T{{ controller.Tier }}
              {{ controller.Class ? controller.Class.Name : controller.Layer.Name }} default values.
              Are you sure?
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn
                variant="tonal"
                color="error"
                @click="
                  controller.ResetStats();
                  resetMenu = false;
                "
                >Reset</v-btn
              >
              <v-spacer />
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { StatController } from '@/classes/components/combat/stats/StatController';
import EditableAttribute from './_subcomponents/EditableAttribute.vue';
import { Bonus } from '@/classes/components';

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
    coreMenu: false,
    customTitle: '',
    customMenu: false,
    resetMenu: false,
  }),
  computed: {
    coreStats() {
      return StatController.CoreStats;
    },
    availableCoreStats() {
      return StatController.CoreStats.filter(
        (x) => !this.item.StatController.DisplayKeys.some((y) => y.key === x.key)
      ).filter((x) => x.key !== 'sizes');
    },
  },
  methods: {
    getBonuses(key: string) {
      return (this.bonuses as Bonus[]).filter((x) => x.ID.includes(key));
    },
    addCoreStats() {
      this.statsToAdd.forEach((x) => this.item.StatController.AddCoreStat(x));
      this.statsToAdd = [];
      this.coreMenu = false;
    },
    addCustomStat() {
      this.item.StatController.AddCustomStat(this.customTitle);
      this.customTitle = '';
      this.customMenu = false;
    },
  },
};
</script>
