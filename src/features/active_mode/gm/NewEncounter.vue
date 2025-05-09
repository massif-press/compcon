<template>
  <v-container>
    <cc-alert>
      info about encounters
      <br />
      when to use a table
    </cc-alert>
    <v-row dense class="mt-4">
      <v-col cols="1" class="text-center">
        <v-icon icon="cc:encounter" :color="selectedEncounter ? 'success' : 'panel'" size="50" />
      </v-col>
      <v-col>
        <cc-panel>
          <cc-titled-divider title="select encounter" color="accent" class="mb-1" />
          <div class="pa-1" style="max-height: 60vh; overflow-y: scroll; overflow-x: hidden">
            <div v-for="(encounter, i) in encounters" style="position: relative">
              <div
                v-if="!selectedEncounter || selectedEncounter.ID === encounter.ID"
                @click="selectedEncounter = encounter"
                class="mb-1 pa-1"
                :key="encounter.ID">
                <v-icon
                  v-if="selectedEncounter"
                  color="error"
                  style="position: absolute; top: 0; right: 0; margin: -2px; z-index: 2"
                  icon="mdi-close"
                  @click.stop="selectedEncounter = null" />
                <gm-encounter-list-item :odd="i % 2 === 0" :item="encounter" />
              </div>
            </div>
          </div>
          <div class="d-flex justify-end mt-2">
            <cc-button
              size="small"
              color="primary"
              prepend-icon="mdi-card-plus-outline"
              class="ml-2"
              @click="useEmptyEncounter()">
              Use New Empty Encounter
            </cc-button>
          </div>
        </cc-panel>
      </v-col>
    </v-row>
    <v-slide-y-transition>
      <v-row v-if="emptyEncounter">
        <v-col cols="1" class="text-center">
          <v-icon icon="mdi-map-legend" :color="emptyEncounter ? 'success' : 'panel'" size="50" />
        </v-col>
        <v-col>
          <cc-panel>
            <cc-titled-divider title="New Encounter Settings" color="accent" />
            if empty - select environment & sitrep
          </cc-panel>
        </v-col>
      </v-row>
    </v-slide-y-transition>
    <v-slide-y-transition>
      <v-row v-if="selectedEncounter || emptyEncounter">
        <v-col cols="1" class="text-center">
          <v-icon icon="cc:pilot" :color="emptyEncounter ? 'success' : 'panel'" size="50" />
        </v-col>
        <v-col>
          <cc-panel>
            <cc-titled-divider title="Add Pilots" color="accent" />
            add pilot sheets (optional)
            <br />
            add pilots by share code (optional)
            <br />
            add untracked pilot items (no pilot data but include encounter trackables)
            <cc-button>done</cc-button>
          </cc-panel>
        </v-col>
      </v-row>
    </v-slide-y-transition>
    <v-slide-y-transition>
      <v-row v-if="selectedEncounter || emptyEncounter">
        <v-col cols="1" class="text-center">
          <v-icon
            icon="mdi-checkbox-marked-circle-auto-outline"
            :color="emptyEncounter ? 'success' : 'panel'"
            size="50" />
        </v-col>
        <v-col>
          <cc-panel>overview and confirm</cc-panel>
        </v-col>
      </v-row>
    </v-slide-y-transition>
  </v-container>
</template>

<script lang="ts">
import { EncounterStore } from '@/stores';
import GmEncounterListItem from '@/features/gm/_views/_components/gmItemCards/GMEncounterListItem.vue';
import { Encounter } from '@/classes/encounter/Encounter';

export default {
  name: 'active-new-encounter',
  components: { GmEncounterListItem },
  data: () => ({
    search: '',
    emptyEncounter: null as any,
    selectedEncounter: null as any,
  }),
  emits: ['select', 'close'],
  computed: {
    encounters() {
      return EncounterStore()
        .Encounters.filter((x) => !x.SaveController.IsDeleted)
        .filter((x) => x.Name.toLowerCase().includes(this.search.toLowerCase()));
    },
  },
  methods: {
    useEmptyEncounter() {
      this.emptyEncounter = new Encounter();
    },
  },
};
</script>
