<template>
  <panel-view ref="view">
    <cc-gm-header slot="title" title="MISSIONS" />
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
      </v-row>
      <v-divider class="my-2 " />
      <v-row dense>
        <v-data-table
          dense
          :items="missions"
          :headers="headers"
          group-by="Campaign"
          :search="search"
          no-results-text="No Missions Found"
          no-data-text="No Saved Missions"
          disable-pagination
          hide-default-footer
          hide-default-header
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
            <span class="accent--text heading clickable ml-n2" @click="toMission(item.ID)">
              <v-menu offset-x left>
                <template v-slot:activator="{ on }">
                  <v-btn icon small class="mt-n1 mr-n2" @click.stop v-on="on">
                    <v-icon small class="fadeSelect">mdi-settings</v-icon>
                  </v-btn>
                </template>
                <v-list dense>
                  <v-list-item @click="copyMission(item)">
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
                      <v-list-item-title>Print Mission Sheets</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-divider />
                  <v-list-item @click="deleteMission(item)">
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
              <v-icon v-if="selectedMission === item" right color="primary">
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
            Add New Mission
          </v-btn>
        </v-col>
      </v-row>
    </template>
    <template slot="right">
      <router-view />
    </template>
  </panel-view>
</template>

<script lang="ts">
import Vue from 'vue'
import PanelView from '../../components/PanelView.vue'
import { getModule } from 'vuex-module-decorators'
import { MissionStore } from '@/store'
import { Mission } from '@/class'

export default Vue.extend({
  name: 'mission-manager',
  components: { PanelView },
  data: () => ({
    search: '',
    selectedMission: null,
    grouping: null,
    headers: [{ text: 'Name', value: 'Name', align: 'left' }],
    missions: [],
  }),
  computed: {
    labels() {
      return this.Missions.flatMap(x => x.Labels).filter(x => x != null && x != '')
    },
    campaigns() {
      return this.Missions.map(x => x.Campaign).filter(x => x != null && x != '')
    },
  },
  watch: {
    selectedMission() {
      this.$refs.view.resetScroll()
    },
  },
  created() {
    const store = getModule(MissionStore, this.$store)
    console.log(store.Missions)
    this.missions = store.Missions
  },
  methods: {
    toMission(id: string) {
      this.$router.push({ name: 'edit-mission', params: { id } })
    },
    deleteMission(Mission: Mission) {
      const store = getModule(MissionStore, this.$store)
      store.deleteMission(Mission)
    },
    copyMission(Mission: Mission) {
      const store = getModule(MissionStore, this.$store)
      store.cloneMission(Mission)
    },
    addNew() {
      const store = getModule(MissionStore, this.$store)
      store.addMission(new Mission())
      const m = this.missions[this.missions.length - 1].ID
      this.$router.push({ name: 'edit-mission', params: { id: m } })
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
