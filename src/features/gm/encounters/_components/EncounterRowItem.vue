<template>
  <tr>
    <td class="text-left">Example Encounter</td>
    <td v-if="active">My Campaign</td>
    <td v-else>Mission 1 // Encounter 3</td>
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
      <span v-if="active">
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
      </span>
    </td>
    <td v-if="active">
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
    <td v-if="active">4</td>
    <div class="text-center">
      <v-btn class="mb-n4" color="accent">Open</v-btn>
    </div>
  </tr>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'encounter-row-item',
  // props: {encounter: {type: Object, required: true}}
  props: ['active'],
})
</script>
