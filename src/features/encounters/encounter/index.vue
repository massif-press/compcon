<template>
  <panel-view ref="view">
    <cc-gm-header slot="title" title="ENCOUNTERS" />
    <template slot="left">
      <v-row dense>
        <v-col>
          <v-text-field
            v-model="search"
            prepend-inner-icon="mdi-magnify"
            dense
            hide-details
            outlined
            clearable
          />
        </v-col>
        <v-col cols="auto">
          <encounter-group @set="grouping = $event" />
        </v-col>
      </v-row>
      <v-divider class="my-2 " />
      <v-row dense>
        <v-data-table
          dense
          :items="encounters"
          :headers="headers"
          :group-by="grouping"
          :search="search"
          no-results-text="No Encounters Found"
          no-data-text="No Saved Encounters"
          disable-pagination
          hide-default-footer
          calculate-widths
          class="transparent"
          style="min-width: 100%"
        >
          <template v-slot:group.header="h" class="transparent">
            <div class="primary sliced">
              <v-icon dark left>mdi-chevron-right</v-icon>
              <span v-if="h.group && h.group !== 'null'" class="heading white--text text-uppercase">
                <span v-if="Array.isArray(h.group)" v-html="h.group.join(', ')" />
                <span v-else v-html="h.group" />
              </span>
              <span v-else>NONE</span>
            </div>
          </template>
          <template v-slot:item.Name="{ item }">
            <span class="accent--text heading clickable ml-n2" @click="selectedEncounter = item">
              <v-menu offset-x left>
                <template v-slot:activator="{ on }">
                  <v-btn icon small class="mt-n1 mr-n2" @click.stop v-on="on">
                    <v-icon small class="fadeSelect">mdi-settings</v-icon>
                  </v-btn>
                </template>
                <v-list dense>
                  <v-list-item @click="copyEncounter(item)">
                    <v-list-item-icon class="ma-0 mr-2 mt-2">
                      <v-icon>mdi-content-copy</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>Copy {{ item.Name }}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item disabled>
                    <v-list-item-icon class="ma-0 mr-2 mt-2">
                      <v-icon>mdi-printer</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>Print Encounter Sheets</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-divider />
                  <v-list-item @click="deleteEncounter(item)">
                    <v-list-item-icon class="ma-0 mr-2 mt-2">
                      <v-icon color="error">mdi-delete</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title class="error--text">
                        Delete {{ item.Name }}
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-menu>
              {{ item.Name }}
            </span>
            <v-scroll-x-transition leave-absolute>
              <v-icon v-if="selectedEncounter === item" right color="primary">
                mdi-chevron-triple-right
              </v-icon>
            </v-scroll-x-transition>
          </template>
          <template v-slot:item.Power="{ item }">
            <span class="caption text-uppercase">{{ item.Power }}</span>
          </template>
        </v-data-table>
      </v-row>
      <v-divider class="my-2 " />
      <v-row justify="center" dense no-gutters>
        <v-col cols="8">
          <v-btn block tile color="primary" large @click="addNew()">
            <v-icon left>mdi-plus</v-icon>
            Add New Encounter
          </v-btn>
        </v-col>
      </v-row>
    </template>
    <template slot="right">
      <encounter-card
        v-if="selectedEncounter"
        :key="selectedEncounter.ID"
        :encounter="selectedEncounter"
      />
    </template>
  </panel-view>
</template>

<script lang="ts">
import Vue from 'vue'
import PanelView from '../components/PanelView.vue'
import EncounterGroup from './components/EncounterGroup.vue'
import EncounterCard from './components/EncounterCard.vue'
import { getModule } from 'vuex-module-decorators'
import { EncounterStore } from '@/store'
import { Encounter } from '@/class'

export default Vue.extend({
  name: 'encounter-manager',
  components: { PanelView, EncounterCard, EncounterGroup },
  data: () => ({
    search: '',
    selectedEncounter: null,
    grouping: null,
    headers: [
      { text: 'Name', value: 'Name', align: 'left' },
      { text: 'PR', value: 'Power', width: '50' },
    ],
    encounters: [],
  }),
  watch: {
    selectedEncounter() {
      this.$refs.view.resetScroll()
    },
  },
  created() {
    const store = getModule(EncounterStore, this.$store)
    this.encounters = store.Encounters
  },
  methods: {
    deleteEncounter(encounter: Encounter) {
      const store = getModule(EncounterStore, this.$store)
      store.deleteEncounter(encounter)
    },
    copyEncounter(encounter: Encounter) {
      const store = getModule(EncounterStore, this.$store)
      store.cloneEncounter(encounter)
    },
    addNew() {
      const store = getModule(EncounterStore, this.$store)
      store.addEncounter(new Encounter())
      const enc = this.encounters[this.encounters.length - 1].ID
      this.$router.push({ name: 'encounter', params: { id: enc } })
    },
  },
})
</script>

<style>
.v-row-group__header,
.v-row-group__summary {
  background: transparent !important;
}
</style>
