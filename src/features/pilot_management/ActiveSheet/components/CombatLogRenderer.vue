<template>
  <v-row dense align="start">
    <v-col>
      <v-row v-for="(l, i) in state.Log" :key="`${l.id}_${i}`" dense>
        <v-col>
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
        </v-col>
        <v-col v-if="l.undoAction" cols="auto" class="ml-auto" align-self="center">
          <cc-tooltip content="Undo this action, refunding any cost it may have had">
            <v-btn x-small color="primary" class="fadeSelect" @click="undo(l.undoAction)">
              <v-icon small left>mdi-reload</v-icon>
              UNDO
            </v-btn>
          </cc-tooltip>
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="auto" class="ml-6">
      <fieldset>
        <legend class="heading h3 accent--text ml-1 px-2">MISSION STATS</legend>
        <div class="pl-2 pr-4">
          <div class="flavor-text">
            MOVES:
            <b class="stark--text">{{ state.Stats.moves }}</b>
          </div>
          <div class="flavor-text">
            DAMAGE DEALT:
            <b class="stark--text">{{ state.Stats.damage }}</b>
          </div>
          <div class="flavor-text">
            ENEMIES DESTROYED:
            <b class="stark--text">{{ state.Stats.kills }}</b>
          </div>
          <div class="flavor-text">
            DAMAGE TAKEN:
            <b class="stark--text">{{ state.Stats.hp_damage }}</b>
          </div>
          <div class="flavor-text">
            STRUCTURE LOST:
            <b class="stark--text">{{ state.Stats.structure_damage }}</b>
          </div>
          <div class="flavor-text">
            HEAT TAKEN:
            <b class="stark--text">{{ state.Stats.heat_damage }}</b>
          </div>
          <div class="flavor-text">
            REACTOR STRESS:
            <b class="stark--text">{{ state.Stats.reactor_damage }}</b>
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
    state: {
      type: Object,
      required: true,
    },
  },
  methods: {
    undo(action) {
      this.state.UndoAction(action)
    },
  },
})
</script>
