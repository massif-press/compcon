<template>
  <v-container>
    <div class="my-2">
      <div class="heading h3">Active Encounters</div>
      <v-simple-table class="mb-2">
        <thead>
          <th>Encounter</th>
          <th>Campaign</th>
          <th>SITREP</th>
          <th>NPCs</th>
          <th>Pilots</th>
          <th>Turn</th>
          <th></th>
        </thead>
        <tbody>
          <tr class="text-center">
            <td class="text-left">Example Encounter</td>
            <td>My Campaign</td>
            <td>GAUNTLET</td>
            <td>
              <v-menu bottom offset-y offset-x open-on-hover>
                <template v-slot:activator="{ on }">
                  <v-btn
                    text
                    color="primary"
                    style="min-width: 0; min-height: 0"
                    class="px-1 py-1"
                    x-large
                    @click.stop
                    v-on="on"
                  >
                    <b>5</b>
                  </v-btn>
                </template>
                <v-list dense>
                  <v-list-item>NPC Name #1</v-list-item>
                  <v-list-item>NPC Name #2</v-list-item>
                  <v-list-item>NPC Name #3</v-list-item>
                  <v-list-item>NPC Name #4</v-list-item>
                  <v-list-item>NPC Name #5</v-list-item>
                </v-list>
              </v-menu>
              (
              <v-menu bottom offset-y offset-x open-on-hover>
                <template v-slot:activator="{ on }">
                  <v-btn
                    text
                    color="primary"
                    style="min-width: 0; min-height: 0"
                    class="px-1 py-1"
                    x-large
                    @click.stop
                    v-on="on"
                  >
                    <b>2</b>
                  </v-btn>
                </template>
                <v-list dense>
                  <v-list-item>Dead NPC #1</v-list-item>
                  <v-list-item>Dead NPC #2</v-list-item>
                </v-list>
              </v-menu>
              <v-icon small>mdi-skull</v-icon>
              )
            </td>
            <td>
              <v-menu bottom offset-y offset-x open-on-hover>
                <template v-slot:activator="{ on }">
                  <v-btn
                    text
                    color="primary"
                    style="min-width: 0; min-height: 0"
                    class="px-1 py-1"
                    x-large
                    @click.stop
                    v-on="on"
                  >
                    <b>3</b>
                  </v-btn>
                </template>
                <v-list dense>
                  <v-list-item>Pilot Callsign #1</v-list-item>
                  <v-list-item>Pilot Callsign #2</v-list-item>
                  <v-list-item>Pilot Callsign #3</v-list-item>
                </v-list>
              </v-menu>
            </td>
            <td>4</td>
            <v-btn class="mb-n4" color="accent">Open</v-btn>
          </tr>
        </tbody>
      </v-simple-table>

      <div class="heading h3">Encounter Library</div>
      <v-simple-table class="mb-2">
        <thead>
          <th>Encounter</th>
          <th>Campaign</th>
          <th>SITREP</th>
          <th>NPCs</th>
          <th></th>
          <th></th>
        </thead>
        <tbody>
          <tr class="text-center">
            <td class="text-left">Example Encounter</td>
            <td>My Campaign</td>
            <td>GAUNTLET</td>
            <td>7</td>
            <td><v-btn color="accent">Edit</v-btn></td>
            <td><v-btn color="accent">Run</v-btn></td>
          </tr>
          <tr class="text-center">
            <td class="text-left">WIP Encounter</td>
            <td>--</td>
            <td>ELIMINATION</td>
            <td>8</td>
            <td><v-btn color="accent">Edit</v-btn></td>
            <td><v-btn color="accent">Run</v-btn></td>
          </tr>
        </tbody>
      </v-simple-table>
    </div>
    <v-row justify="center" align="center">
      <v-col cols="8">
        <v-btn color="primary" block large>
          <v-icon left v-html="'mdi-plus'" />
          Create New Encounter
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
  name: 'encounter-landing',
})
</script>