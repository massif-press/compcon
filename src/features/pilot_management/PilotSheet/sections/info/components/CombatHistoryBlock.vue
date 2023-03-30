<template>
  <div>
    <cc-title
      small
      color="pilot"
      class="pl-3"
      style="margin-left: -70px !important"
    >
      <span class="ml-9">&emsp;</span>
      Pilot Combat Telemetry Record
    </cc-title>
    <v-row density="compact" class="stat-text pt-2 pb-2 pl-2 mt-n2">
      <v-col>
        <div>
          MOVES:
          <b class="text-stark">{{ pilot.CombatHistory.moves }}</b>
        </div>
        <div>
          DAMAGE DEALT:
          <b class="text-stark">{{ pilot.CombatHistory.damage }}</b>
        </div>
        <div>
          ENEMIES DESTROYED:
          <b class="text-stark">{{ pilot.CombatHistory.kills }}</b>
        </div>
        <div>
          DAMAGE TAKEN:
          <b class="text-stark">{{ pilot.CombatHistory.hp_damage }}</b>
        </div>
        <div>
          STRUCTURE LOST:
          <b class="text-stark">{{ pilot.CombatHistory.structure_damage }}</b>
        </div>
        <div>
          HEAT TAKEN:
          <b class="text-stark">{{ pilot.CombatHistory.heat_damage }}</b>
        </div>
        <div>
          REACTOR STRESS:
          <b class="text-stark">{{ pilot.CombatHistory.reactor_damage }}</b>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
export default {
  name: 'combat-history-block',
};
</script>
