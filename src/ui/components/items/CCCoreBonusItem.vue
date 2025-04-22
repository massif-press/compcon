<template>
  <cc-panel
    :title="bonus.Name"
    :icon="bonus.Icon"
    :title-color="bonus.Color"
    style="position: relative">
    <div v-if="bonus.InLcp" style="position: absolute; top: 27px; right: 4px; z-index: 1">
      <cc-lcp-info v-if="bonus.InLcp" :item="bonus" />
    </div>
    <p v-html-safe="bonus.Effect" class="pb-1" />

    <div v-if="bonus.Actions.length">
      <div class="text-cc-overline text-disabled">CORE BONUS ACTIONS</div>
      <v-row no-gutters justify="center">
        <v-col v-for="(a, i) in bonus.Actions" cols="auto">
          <cc-action :action="a" :panel="!terse" class="ma-2" />
        </v-col>
      </v-row>
    </div>

    <div v-if="bonus.Deployables.length">
      <div class="text-cc-overline text-disabled">CORE BONUS DEPLOYABLES</div>
      <v-row no-gutters justify="center">
        <v-col v-for="(d, i) in bonus.Deployables" cols="auto">
          <cc-deployable-info
            :deployable="d"
            :panel="!terse"
            :name-override="bonus.Name"
            class="ma-2" />
        </v-col>
      </v-row>
    </div>

    <div v-if="bonus.IntegratedEquipment.length">
      <div class="text-cc-overline text-disabled">CORE BONUS INTEGRATED EQUIPMENT</div>
      <v-row no-gutters justify="center">
        <v-col v-for="(x, i) in bonus.IntegratedEquipment" cols="auto">
          <cc-integrated-info :item="x" :panel="!terse" />
        </v-col>
      </v-row>
    </div>

    <div v-if="bonus.SpecialEquipment.length">
      <div class="text-cc-overline text-disabled">CORE BONUS ADDITIONAL EQUIPMENT</div>
      <v-row no-gutters justify="center">
        <v-col v-for="(x, i) in bonus.SpecialEquipment" cols="auto">
          <cc-integrated-info :item="x" :panel="!terse" />
        </v-col>
      </v-row>
    </div>
  </cc-panel>
</template>

<script lang="ts">
export default {
  name: 'cc-core-bonus-item',
  props: {
    bonus: {
      type: Object,
      required: true,
    },
    terse: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
