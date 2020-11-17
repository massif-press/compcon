<template>
  <v-row dense align="start">
    <v-col>
      <div v-for="(l, i) in log" :key="`${l.id}_${i}`">
        <div class="caption subtle--text mb-n1">
          MISSION {{ l.mission }} // ENCOUNTER {{ l.encounter }} // ROUND {{ l.round }} ::
          {{ l.timestamp }}
        </div>
        <p class="flavor-text ma-0 ml-3 mb-2">
          >//[
          <span class="accent--text">{{ l.event }}</span>
          ]
          <span class="stark--text">{{ l.detail }}</span>
        </p>
      </div>
    </v-col>
    <v-col cols="auto">
      <fieldset>
        <legend class="heading h3 accent--text ml-1 px-2">MISSION STATS</legend>
        <div class="pl-2 pr-4">
          <div class="flavor-text">
            MOVES:
            <b class="stark--text">{{ stats.moves }}</b>
          </div>
          <div class="flavor-text">
            DAMAGE DEALT:
            <b class="stark--text">{{ stats.damage }}</b>
          </div>
          <div class="flavor-text">
            ENEMIES DESTROYED:
            <b class="stark--text">{{ stats.kills }}</b>
          </div>
          <div class="flavor-text">
            DAMAGE TAKEN:
            <b class="stark--text">{{ stats.hp_damage }}</b>
          </div>
          <div class="flavor-text">
            STRUCTURE LOST:
            <b class="stark--text">{{ stats.structure_damage }}</b>
          </div>
          <div class="flavor-text">
            HEAT TAKEN:
            <b class="stark--text">{{ stats.heat_damage }}</b>
          </div>
          <div class="flavor-text">
            REACTOR STRESS:
            <b class="stark--text">{{ stats.reactor_damage }}</b>
          </div>
        </div>
      </fieldset>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'combat-log-renderer',
  props: {
    log: {
      type: Array,
      required: true,
    },
    stats: {
      type: Object,
      required: true,
    },
  },
})
</script>
