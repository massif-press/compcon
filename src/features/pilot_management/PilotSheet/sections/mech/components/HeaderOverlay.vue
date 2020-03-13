<!-- temp lame hack -->
<template>
  <div style="position: relative">
    <v-row id="stat-row" dense>
      <v-col cols="2" offset="1" class="unskew">
        <cc-tooltip
          simple
          inline
          delay
          :content="`Structure: ${mech.CurrentStructure}/${mech.MaxStructure}`"
        >
          <v-icon>cci-structure</v-icon>
        </cc-tooltip>
        <span class="stat-text">{{ mech.CurrentStructure }}</span>
        <span class="flavor-text subtle--text" style="font-size:14px">
          /{{ mech.MaxStructure }}
        </span>
      </v-col>
      <v-col cols="2" class="unskew">
        <cc-tooltip simple inline delay :content="`HP: ${mech.CurrentHP}/${mech.MaxHP}`">
          <v-icon>mdi-heart-outline</v-icon>
        </cc-tooltip>
        <span class="stat-text">{{ mech.CurrentHP }}</span>
        <span class="flavor-text subtle--text" style="font-size:14px">/{{ mech.MaxHP }}</span>
      </v-col>
      <v-col cols="2" class="unskew">
        <cc-tooltip
          simple
          inline
          delay
          :content="`Reactor Stress: ${mech.CurrentStress}/${mech.MaxStress}`"
        >
          <v-icon>cci-reactor</v-icon>
        </cc-tooltip>
        <span class="stat-text">{{ mech.CurrentStress }}</span>
        <span class="flavor-text subtle--text" style="font-size:14px">/{{ mech.MaxStress }}</span>
      </v-col>
      <v-col cols="2" class="unskew">
        <cc-tooltip simple inline delay :content="`Heat: ${mech.CurrentHeat}/${mech.HeatCapacity}`">
          <v-icon>mdi-fire</v-icon>
        </cc-tooltip>
        <span class="stat-text">{{ mech.CurrentHeat }}</span>
        <span class="flavor-text subtle--text" style="font-size:14px">
          /{{ mech.HeatCapacity }}
        </span>
      </v-col>
      <v-col cols="2" class="unskew">
        <cc-tooltip
          simple
          inline
          delay
          :content="`Repair Capacity: ${mech.CurrentRepairs}/${mech.RepairCapacity}`"
        >
          <v-icon>cci-repair</v-icon>
        </cc-tooltip>
        <span class="stat-text">{{ mech.CurrentRepairs }}</span>
        <span class="flavor-text subtle--text" style="font-size:14px">
          /{{ mech.RepairCapacity }}
        </span>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'header-overlay',
  props: {
    mech: {
      type: Object,
      required: true,
    },
  },
})
</script>

<style scoped>
#stat-row {
  position: absolute;
  top: -63px;
  left: -20px;
  transform: skew(0.65rad);
  background-color: var(--v-panel-base);
  color: var(--v-text-base);
  z-index: 2;
  width: 75vw;
  margin-left: -20px;
}
.unskew {
  transform: skew(-0.65rad);
}
</style>
