<template>
  <div :style="unlocked ? '' : 'opacity: 0.6'">
    <div v-html-safe="talentRank.Description" class="text--text" />
    <div v-if="talentRank.Actions.length">
      <v-row dense justify="center">
        <v-col
          v-for="(a, i) in talentRank.Actions"
          :key="`${talentRank.Name}_action_${i}`"
          cols="auto"
        >
          <cc-action :action="a" hover class="ma-2" />
        </v-col>
      </v-row>
    </div>

    <div v-if="talentRank.Deployables.length">
      <v-row dense justify="center">
        <v-col
          v-for="(d, i) in talentRank.Deployables"
          :key="`${talentRank.Name}_deployable_${i}`"
          cols="auto"
        >
          <cc-deployable-info :deployable="d" hover :name-override="talentRank.Name" class="ma-2" />
        </v-col>
      </v-row>
    </div>

    <div v-if="talentRank.IntegratedEquipment.length">
      <v-row dense justify="center">
        <v-col
          v-for="(x, i) in talentRank.IntegratedEquipment"
          :key="`${talentRank.Name}_integrated_${i}`"
          cols="auto"
        >
          <cc-integrated-info :item="x" hover />
        </v-col>
      </v-row>
    </div>

    <div v-if="talentRank.SpecialEquipment.length">
      <v-row dense justify="center">
        <v-col
          v-for="(x, i) in talentRank.SpecialEquipment"
          :key="`${talentRank.Name}_special_${i}`"
          cols="auto"
        >
          <cc-integrated-info :item="x" hover />
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'talent-rank-contents',
  props: {
    talentRank: { type: Object, required: true },
    unlocked: { type: Boolean, default: true },
  },
})
</script>