<template>
  <div class="pa-2 mt-3">
    <div class="text-overline text-primary" style="line-height: 15px">
      {{ encounter.Name }}
      <span class="text-black">&mdash; NPC TRACKING</span>
    </div>
  </div>

  <v-row dense>
    <v-col>
      <div class="text-caption">ENEMIES</div>
      <npc-tracker v-for="c in Enemies" :combatant="c" />
    </v-col>
    <v-col>
      <div class="text-caption">PCS/ALLIES</div>
      <npc-tracker v-for="c in Enemies" :combatant="c" />
    </v-col>
  </v-row>
  <div v-if="Other.length > 0">
    <div class="text-caption mt-1">OTHER</div>
    <npc-tracker v-for="c in Enemies" :combatant="c" />
  </div>
</template>

<script lang="ts">
import NpcTracker from '../components/NpcTracker.vue';

import Notes from '../components/blank/notes.vue';
import BlankLine from '../components/blank/line.vue';
import PageBreak from '../components/PageBreak.vue';
import _ from 'lodash';

export default {
  name: 'gm-tracker-print',
  components: {
    Notes,
    BlankLine,
    PageBreak,
    NpcTracker,
  },

  props: {
    encounter: {
      type: Object,
      required: true,
    },
  },
  computed: {
    SortedCombatants() {
      return _.sortBy(this.encounter.Combatants, (x) => x.playerCount).filter(
        (x) => x.npc && x.npc.ItemType.toLowerCase() !== 'eidolon'
      );
    },
    Enemies() {
      return this.SortedCombatants.filter((x) => x.side === 'enemy');
    },
    Allies() {
      return this.SortedCombatants.filter((x) => x.side === 'ally');
    },
    Other() {
      return this.SortedCombatants.filter((x) => x.side === 'other');
    },
  },
};
</script>

<style scoped>
.caption {
  font-size: 12px;
}

.p-stat {
  font-size: 34px;
}

fieldset {
  padding: 0 4px;
  height: 100%;
  border-radius: 3px;
  border-color: rgb(var(--v-theme-grey-lighten2));
}
</style>
