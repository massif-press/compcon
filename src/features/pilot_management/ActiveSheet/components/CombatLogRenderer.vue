<template>
  <v-row density="compact" align="start">
    <v-col>
      <v-row v-for="(l, i) in state.Log" density="compact">
        <v-col>
          <div class="caption text-subtle mb-n1">
            MISSION {{ l.mission }} // ENCOUNTER {{ l.encounter }} // ROUND
            {{ l.round }} ::
            {{ l.timestamp }}
          </div>
          <p class="flavor-text ma-0 ml-3 mb-2">
            >//[
            <span class="text-accent">{{ l.event }}</span>
            ]
            <span class="text-stark">{{ l.detail }}</span>
          </p>
        </v-col>
        <v-col
          v-if="l.undoAction"
          cols="auto"
          class="ml-auto"
          align-self="center"
        >
          <cc-tooltip
            content="Undo this action, refunding any cost it may have had"
          >
            <v-btn
              x-small
              color="primary"
              class="fade-select"
              @click="undo(l.undoAction)"
            >
              <v-icon small left>mdi-reload</v-icon>
              UNDO
            </v-btn>
          </cc-tooltip>
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="auto" class="ml-6">
      <fieldset>
        <legend class="heading h3 text-accent ml-1 px-2">MISSION STATS</legend>
        <div class="pl-2 pr-4">
          <div class="flavor-text">
            MOVES:
            <b class="text-stark">{{ state.Stats.moves }}</b>
          </div>
          <div class="flavor-text">
            DAMAGE DEALT:
            <b class="text-stark">{{ state.Stats.damage }}</b>
          </div>
          <div class="flavor-text">
            ENEMIES DESTROYED:
            <b class="text-stark">{{ state.Stats.kills }}</b>
          </div>
          <div class="flavor-text">
            DAMAGE TAKEN:
            <b class="text-stark">{{ state.Stats.hp_damage }}</b>
          </div>
          <div class="flavor-text">
            STRUCTURE LOST:
            <b class="text-stark">{{ state.Stats.structure_damage }}</b>
          </div>
          <div class="flavor-text">
            HEAT TAKEN:
            <b class="text-stark">{{ state.Stats.heat_damage }}</b>
          </div>
          <div class="flavor-text">
            REACTOR STRESS:
            <b class="text-stark">{{ state.Stats.reactor_damage }}</b>
          </div>
        </div>
      </fieldset>
    </v-col>
  </v-row>
</template>

<script lang="ts">
export default {
  name: 'combat-log-renderer',
  props: {
    state: {
      type: Object,
      required: true,
    },
  },
  methods: {
    undo(action) {
      this.state.UndoAction(action);
    },
  },
};
</script>
