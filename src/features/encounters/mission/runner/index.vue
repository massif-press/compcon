<template>
  <v-container style="margin-top: 50px; min-height: calc(100vh - 50px)">
    <v-row justify="center">
      <v-col>
        <cc-title class="mt-3">
          ACTIVE MISSIONS
        </cc-title>
        <v-data-table
          :items="activeMissions"
          :headers="headers"
          group-by="Campaign"
          no-data-text="No Active Missions"
          hide-default-footer
          class="transparent"
          style="min-width: 100%"
        >
          <template v-slot:group.header="h" class="transparent">
            <div class="primary sliced">
              <v-icon dark left>mdi-chevron-right</v-icon>
              <span class="heading white--text">
                {{ h.group ? h.group.toUpperCase() : 'NONE' }}
              </span>
            </div>
          </template>
        </v-data-table>

        <v-btn block large outlined tile color="primary">
          Begin New Mission
        </v-btn>
      </v-col>
    </v-row>
    <v-divider />
    <v-row justify="center">
      <v-col cols="11">
        <cc-title small class="mt-3">
          COMPLETED MISSIONS
        </cc-title>
        <v-data-table
          :items="completedMissions"
          :headers="completedHeaders"
          group-by="Campaign"
          no-data-text="No Completed Missions"
          hide-default-footer
          class="transparent"
          style="min-width: 100%"
        >
          <template v-slot:group.header="h" class="transparent">
            <div class="primary sliced">
              <v-icon dark left>mdi-chevron-right</v-icon>
              <span class="heading white--text">
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
export default Vue.extend({
  name: 'active-mission-landing',
  data: () => ({
    headers: [
      { text: 'Name', value: 'Name', align: 'left' },
      { text: 'Encounter', value: 'CurrentEncounter' },
      { text: 'Turn', value: 'CurrentTurn' },
      { text: 'Date Started', value: 'StartDate' },
    ],
    completedHeaders: [
      { text: 'Name', value: 'Name', align: 'left' },
      { text: 'Date Started', value: 'StartDate' },
      { text: 'Date Finished', value: 'EndDate' },
      { text: 'Result', value: 'Result' },
    ],
    activeMissions: [],
    completedMissions: [],
  }),
})
</script>
