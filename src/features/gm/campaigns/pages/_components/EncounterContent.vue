<template>
  <div v-if="item" class="text-text">
    <v-row>
      <v-col>
        <v-row dense>
          <v-col>
            <div class="heading h2 mt-n2 mb-n1">
              {{ item.Name }}
            </div>
          </v-col>
        </v-row>
        <cc-sitrep-display :sitrep="item.Sitrep" />
        <cc-environment-display :environment="item.Environment" />
      </v-col>
      <v-col cols="3" class="text-center ml-auto">
        <v-card>
          <v-tabs v-model="mapTab" grow color="secondary" bg-color="panel" density="compact">
            <v-tab>Map</v-tab>
            <v-tab>Image</v-tab>
          </v-tabs>
          <v-window v-model="mapTab">
            <v-window-item>
              <v-card style="height: 100%" variant="outlined">
                <map-preview ref="mapPreview" v-if="item.Map" :map="item.Map" />
                <v-row
                  v-else
                  style="min-height: 22vw; max-width: 100%"
                  align="center"
                  justify="center">
                  <v-col>
                    <i class="text-disabled text-caption">No Map Data</i>
                  </v-col>
                </v-row>
              </v-card>
            </v-window-item>
            <v-window-item>
              <cc-img :src="item.PortraitController.Image" />
            </v-window-item>
          </v-window>
        </v-card>
      </v-col>
    </v-row>

    <v-card variant="tonal" class="ma-2"><p class="pa-2" v-html-safe="item.Description" /></v-card>

    <combatant-editor :encounter="item" readonly />

    <v-divider
      v-if="
        item.NarrativeController.TextItems.length ||
        item.NarrativeController.Clocks.length ||
        item.NarrativeController.Tables.length
      "
      class="my-4" />

    <div class="text-text px-4">
      <v-card v-for="t in item.NarrativeController.TextItems" variant="flat">
        <div class="heading mt-1">{{ t.header }}</div>
        <p class="pl-4" v-html-safe="t.body" />
      </v-card>
      <cc-clock
        v-for="c in item.NarrativeController.Clocks"
        :clock="c"
        density="compact"
        class="my-2"
        readonly />
      <cc-rollable-table
        v-for="t in item.NarrativeController.Tables"
        :table="t"
        density="compact"
        class="my-2"
        readonly />
    </div>
  </div>
</template>

<script lang="ts">
import { EncounterStore } from '@/stores';
import MapPreview from '@/features/gm/encounters/_components/map/MapPreview.vue';
import CombatantEditor from '@/features/gm/encounters/_components/combatants/CombatantEditor.vue';

export default {
  name: 'narrative-content',
  components: { MapPreview, CombatantEditor },
  props: {
    data: { type: Object, required: true },
  },
  data: () => ({
    mapTab: 0,
  }),
  computed: {
    item() {
      const refElement = EncounterStore()
        .Encounters.filter((x) => !x.SaveController.IsDeleted)
        .find((x) => x.ID === this.data?.ID);
      if (refElement) return refElement;
      return this.data;
    },
    combatants() {
      return {
        Enemies: this.item.Combatants.filter((x) => x.side === 'enemy'),
        Allies: this.item.Combatants.filter((x) => x.side === 'ally'),
        Other: this.item.Combatants.filter((x) => x.side === 'other'),
      };
    },
  },
};
</script>
