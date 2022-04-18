<template>
  <v-container>
    <v-row>
      <v-col cols="auto">
        <v-btn-toggle mandatory>
          <v-btn small icon value="list">
            <v-icon color="accent">mdi-table</v-icon>
          </v-btn>
          <v-btn small icon value="cards">
            <v-icon color="accent">mdi-view-agenda</v-icon>
          </v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>
    <div class="my-2">
      <v-simple-table>
        <thead>
          <th>Campaign</th>
          <th>Pilots</th>
          <th>Beats</th>
          <th>Missions</th>
          <th>Encounters</th>
          <th>Status</th>
          <th></th>
        </thead>
        <tbody>
          <tr class="text-center">
            <td class="text-left">Example Campaign</td>
            <td>3</td>
            <td>11</td>
            <td>4</td>
            <td>12</td>
            <td>In-progress (Beat 4)</td>
            <v-btn class="mb-n4" color="accent">Open</v-btn>
          </tr>
          <tr class="text-center">
            <td class="text-left">WIP Campaign</td>
            <td>--</td>
            <td>4</td>
            <td>1</td>
            <td>2</td>
            <td>--</td>
            <v-btn class="mb-n4" color="accent">Open</v-btn>
          </tr>
        </tbody>
      </v-simple-table>
    </div>
    <v-row justify="center" align="center">
      <v-col cols="8">
        <v-btn color="primary" block large>
          <v-icon left v-html="'mdi-plus'" />
          Create New Campaign
        </v-btn>
      </v-col>
    </v-row>
    <v-footer fixed>
      <v-btn small to="/gm">
        <v-icon left>mdi-chevron-left</v-icon>
        Return to GM Menu
      </v-btn>
    </v-footer>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'campaign-landing',
})
</script>