<template>
  <div class="mb-1">
    <div
      v-html-safe="talentRank.Description"
      class="text-text"
      :style="inColumn ? 'width: 40vw' : ''" />

    <div v-if="talentRank.Actions.length">
      <v-row justify="center" class="py-1">
        <v-col v-for="a in talentRank.Actions" cols="auto">
          <cc-action :action="a" hover />
        </v-col>
      </v-row>
    </div>

    <div v-if="talentRank.Deployables.length">
      <v-row justify="center" class="pb-1 pt-2">
        <v-col v-for="d in talentRank.Deployables" cols="auto">
          <cc-deployable-info :deployable="d" hover :name-override="talentRank.Name" />
        </v-col>
      </v-row>
    </div>

    <div v-if="talentRank.IntegratedEquipment.length">
      <v-row justify="center" class="pb-1 pt-2">
        <v-col v-for="x in talentRank.IntegratedEquipment" cols="auto">
          <cc-integrated-info :item="x" hover />
        </v-col>
      </v-row>
    </div>

    <div v-if="talentRank.SpecialEquipment.length">
      <v-row justify="center" class="pb-1 pt-2">
        <v-col v-for="x in talentRank.SpecialEquipment" cols="auto">
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
    inColumn: { type: Boolean, default: false },
  },
};
</script>
