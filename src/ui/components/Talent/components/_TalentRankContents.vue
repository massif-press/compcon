<template>
  <div>
    <div v-html-safe="talentRank.Description"
      class="text-text"
      :style="inColumn ? 'width: 40vw' : ''" />

    <div v-if="!hideActions">
      <v-row v-if="talentRank.Actions.length"
        justify="center"
        class="py-1"
        dense>
        <v-col v-for="(a, index) in talentRank.Actions"
          :key="`action-${index}`"
          cols="auto">
          <cc-action :action="a"
            hover />
        </v-col>
      </v-row>

      <v-row v-if="talentRank.Deployables.length"
        justify="center"
        class="pb-1 pt-2"
        dense>
        <v-col v-for="(d, index) in talentRank.Deployables"
          :key="`deployable-${index}`"
          cols="auto">
          <cc-deployable-info :deployable="d"
            hover
            :name-override="talentRank.Name" />
        </v-col>
      </v-row>

      <v-row v-if="talentRank.IntegratedEquipment.length"
        justify="center"
        class="pb-1 pt-2"
        dense>
        <v-col v-for="(x, index) in talentRank.IntegratedEquipment"
          :key="`integrated-${index}`"
          cols="auto">
          <cc-integrated-info :item="x"
            hover />
        </v-col>
      </v-row>

      <v-row v-if="talentRank.SpecialEquipment.length"
        justify="center"
        class="pb-1 pt-2"
        dense>
        <v-col v-for="(x, index) in talentRank.SpecialEquipment"
          :key="`special-${index}`"
          cols="auto">
          <cc-integrated-info :item="x"
            hover />
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  talentRank: object
  inColumn?: boolean
  hideActions?: boolean
}>(), {
  inColumn: false,
  hideActions: false
})
</script>
