<template>
  <cc-panel :title="bonus.Name" :icon="bonus.Icon" :title-color="bonus.Color">
    <p v-if="bonus.InLcp" v-html-safe="bonus.LcpName" class="text-stat heading h3" />
    <p v-if="!terse" v-html-safe="bonus.Description" class="flavor-text mb-2" />
    <p v-html-safe="bonus.Effect" class="pb-1" />

    <div v-if="bonus.Actions.length">
      <div class="text-overline ml-n2 mb-n2 text-disabled">CORE BONUS ACTIONS</div>
      <v-row no-gutters justify="center">
        <v-col v-for="(a, i) in bonus.Actions" cols="auto">
          <cc-action :action="a" :panel="!terse" class="ma-2" />
        </v-col>
      </v-row>
    </div>

    <div v-if="bonus.Deployables.length">
      <div class="text-overline ml-n2 mb-n2 text-disabled">CORE BONUS DEPLOYABLES</div>
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
      <div class="text-overline ml-n2 mb-n2 text-disabled">CORE BONUS INTEGRATED EQUIPMENT</div>
      <v-row no-gutters justify="center">
        <v-col v-for="(x, i) in bonus.IntegratedEquipment" cols="auto">
          <cc-integrated-info :item="x" :panel="!terse" />
        </v-col>
      </v-row>
    </div>

    <div v-if="bonus.SpecialEquipment.length">
      <div class="text-overline ml-n2 mb-n2 text-disabled">CORE BONUS ADDITIONAL EQUIPMENT</div>
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
