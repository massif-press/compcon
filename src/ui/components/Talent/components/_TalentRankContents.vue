<template>
  <div class="mb-1">
    <div
      v-html-safe="talentRank.Description"
      class="text-text"
      :style="inColumn ? 'width: 40vw' : ''" />

    <v-row v-if="talentRank.Actions.length" justify="center" class="py-1" dense>
      <v-col v-for="a in talentRank.Actions" cols="auto">
        <cc-action :action="a" hover />
      </v-col>
    </v-row>

    <v-row v-if="talentRank.Deployables.length" justify="center" class="pb-1 pt-2" dense>
      <v-col v-for="d in talentRank.Deployables" cols="auto">
        <cc-deployable-info :deployable="d" hover :name-override="talentRank.Name" />
      </v-col>
    </v-row>

    <v-row v-if="talentRank.IntegratedEquipment.length" justify="center" class="pb-1 pt-2" dense>
      <v-col v-for="x in talentRank.IntegratedEquipment" cols="auto">
        <cc-integrated-info :item="x" hover />
      </v-col>
    </v-row>

    <v-row v-if="talentRank.SpecialEquipment.length" justify="center" class="pb-1 pt-2" dense>
      <v-col v-for="x in talentRank.SpecialEquipment" cols="auto">
        <cc-integrated-info :item="x" hover />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
export default {
  name: 'talent-rank-contents',
  props: {
    talentRank: { type: Object, required: true },
    inColumn: { type: Boolean, default: false },
  },
};
</script>
