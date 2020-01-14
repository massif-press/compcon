<template>
  <v-container fluid style="margin-top: 50px; min-height: calc(100vh - 50px)">
    <v-row justify="center">
      <v-col>
        <cc-title class="mt-3 ml-n12" color="primary">
          &emsp;ACTIVE MISSIONS
        </cc-title>
        <v-data-table
          :items="activeMissions"
          :headers="headers"
          no-data-text="No Active Missions"
          hide-default-footer
          class="transparent heading h3"
          style="min-width: 100%"
        >
          <template v-slot:item.Mission.Name="{ item }">
            {{ item.Mission.Name }}
            <span class="overline">
              {{
                item.Mission.Campaign && item.Mission.Campaign !== 'None'
                  ? `//${item.Mission.Campaign}`
                  : ''
              }}
            </span>
          </template>
          <template v-slot:item.Encounter="{ item }">
            <span v-if="item.Mission.Steps[item.Step].Name">
              {{ item.Mission.Steps[item.Step].Name }}
            </span>
            <span v-else>{{ item.Mission.Steps[item.Step].IsLong ? 'Full' : 'Short' }} Rest</span>
          </template>
          <template v-slot:item.Continue="{ item }">
            <v-menu offset-y offset-x top nudge-left="30px">
              <template v-slot:activator="{ on }">
                <v-btn small icon color="error" class="fadeSelect mr-2" v-on="on">
                  <v-icon small>mdi-delete</v-icon>
                </v-btn>
              </template>
              <v-card>
                <v-card-text class="text-center">
                  This will delete the active mission
                  <b>({{ item.Mission.Name }} - {{ item.StartDate }})</b>
                  and all progress will be lost.
                  <br />
                  Are you sure?
                  <v-divider class="my-2" />
                  <v-row dense>
                    <v-btn small text>CANCEL</v-btn>
                    <v-btn small color="error" class="ml-auto" @click="deleteActiveMission(item)">
                      CONFIRM
                    </v-btn>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-menu>
            <v-btn small tile color="primary" :to="`runner/${item.ID}`">
              CONTINUE MISSION
              <v-icon right>mdi-chevron-double-right</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col>
        <cc-title class="mt-3 ml-n12" color="secondary">
          &emsp;AVAILABLE MISSIONS
        </cc-title>
        <v-data-table
          :items="availableMissions"
          :headers="availableHeaders"
          group-by="Campaign"
          no-data-text="No Saved Missions"
          hide-default-footer
          class="transparent heading"
          style="min-width: 100%"
        >
          <template v-slot:group.header="h" class="transparent">
            <div class="secondary darken-2 sliced">
              <span class="heading white--text ml-3">
                {{ h.group ? h.group.toUpperCase() : 'NONE' }}
              </span>
            </div>
          </template>
          <template v-slot:item.Name="{ item }">
            <span class="heading h3">
              {{ item.Name }}
            </span>
          </template>
          <template v-slot:item.Encounters="{ item }">
            <span class="heading h3">
              {{ item.Encounters.length }}
              <span class="overline">// {{ item.Rests.length }} Rests</span>
            </span>
          </template>
          <template v-slot:item.Labels="{ item }">
            <v-chip v-for="l in item.Labels" :key="item.ID + l" small>{{ l }}</v-chip>
          </template>
          <template v-slot:item.Start="{ item }">
            <v-btn small tile color="primary" :to="`briefing/${item.ID}`">
              START MISSION
              <v-icon right>mdi-chevron-double-right</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col>
        <cc-title class="mt-3 ml-n12" color="pilot">
          &emsp;COMPLETED MISSIONS
        </cc-title>
        <v-data-table
          :items="completedMissions"
          :headers="completedHeaders"
          group-by="Campaign"
          no-data-text="No Completed Missions"
          hide-default-footer
          class="transparent heading h3"
          style="min-width: 100%"
        >
          <template v-slot:group.header="h" class="transparent">
            <div class="primary sliced">
              <span class="heading white--text ml-3">
                {{ h.group ? h.group.toUpperCase() : 'NONE' }}
              </span>
            </div>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { getModule } from 'vuex-module-decorators'
import { MissionStore } from '@/store'
import { ActiveMission } from '@/class'

export default Vue.extend({
  name: 'active-mission-landing',
  data: () => ({
    headers: [
      { text: 'Name', value: 'Mission.Name', align: 'left' },
      { text: 'Encounter', value: 'Encounter' },
      { text: 'Round', value: 'Round' },
      { text: 'Date Started', value: 'StartDate' },
      { text: '', value: 'Continue', align: 'right' },
    ],
    availableHeaders: [
      { text: 'Name', value: 'Name', align: 'left' },
      { text: 'Encounters', value: 'Encounters' },
      { text: 'Labels', value: 'Labels' },
      { text: '', value: 'Start', align: 'right' },
    ],
    completedHeaders: [
      { text: 'Name', value: 'Name', align: 'left' },
      { text: 'Date Started', value: 'StartDate' },
      { text: 'Date Finished', value: 'EndDate' },
      { text: 'Result', value: 'Result' },
    ],
    activeMissions: [],
    availableMissions: [],
    completedMissions: [],
  }),
  created() {
    const store = getModule(MissionStore, this.$store)
    this.availableMissions = store.Missions
    this.activeMissions = store.ActiveMissions
  },
  methods: {
    deleteActiveMission(m: ActiveMission) {
      const store = getModule(MissionStore, this.$store)
      store.deleteActiveMission(m)
    },
  },
})
</script>
