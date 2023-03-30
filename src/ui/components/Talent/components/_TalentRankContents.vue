<template>
  <div :style="unlocked ? '' : 'opacity: 0.6'">
    <div v-html-safe="talentRank.Description" class="text-text" />
    <div v-if="talentRank.Actions.length">
      <v-row density="compact" justify="center">
        <v-col v-for="(a, i) in talentRank.Actions" cols="auto">
          <cc-action :action="a" hover class="ma-2" />
        </v-col>
      </v-row>
    </div>

    <div v-if="talentRank.Deployables.length">
      <v-row density="compact" justify="center">
        <v-col v-for="(d, i) in talentRank.Deployables" cols="auto">
          <cc-deployable-info
            :deployable="d"
            hover
            :name-override="talentRank.Name"
            class="ma-2"
          />
        </v-col>
      </v-row>
    </div>

    <div v-if="talentRank.IntegratedEquipment.length">
      <v-row density="compact" justify="center">
        <v-col v-for="(x, i) in talentRank.IntegratedEquipment" cols="auto">
          <cc-integrated-info :item="x" hover />
        </v-col>
      </v-row>
    </div>

    <div v-if="talentRank.SpecialEquipment.length">
      <v-row density="compact" justify="center">
        <v-col v-for="(x, i) in talentRank.SpecialEquipment" cols="auto">
          <cc-integrated-info :item="x" hover />
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'talent-rank-contents',
  props: {
    talentRank: { type: Object, required: true },
    unlocked: { type: Boolean, default: true },
  },
};
</script>
