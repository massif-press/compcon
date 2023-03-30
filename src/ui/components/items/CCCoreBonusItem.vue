<template>
  <cc-titled-panel :title="bonus.Name" density="compact">
    <p
      v-if="bonus.InLcp"
      v-html-safe="bonus.LcpName"
      class="text-stat heading h3"
    />
    <p
      v-show="$vuetify.display.mdAndUp"
      v-html-safe="bonus.Description"
      class="flavor-text pb-0 mb-2 mt-0"
    />
    <p
      v-if="$vuetify.display.mdAndUp"
      v-html-safe="bonus.Effect"
      class="effect-text pa-2 mx-2 mb-2 light-panel clipped"
    />
    <div v-else v-html-safe="bonus.Effect" class="body-text mt-n1 pb-1" />
    <div v-if="bonus.Actions.length">
      <div class="text-overline ml-n2 mb-n2 text-subtle">
        CORE BONUS ACTIONS
      </div>
      <v-row no-gutters justify="center">
        <v-col v-for="(a, i) in bonus.Actions" cols="auto">
          <cc-action
            :action="a"
            :panel="$vuetify.display.lgAndUp"
            class="ma-2"
          />
        </v-col>
      </v-row>
    </div>

    <div v-if="bonus.Deployables.length">
      <div class="text-overline ml-n2 mb-n2 text-subtle">
        CORE BONUS DEPLOYABLES
      </div>
      <v-row no-gutters justify="center">
        <v-col v-for="(d, i) in bonus.Deployables" cols="auto">
          <cc-deployable-info
            :deployable="d"
            :panel="$vuetify.display.lgAndUp"
            :name-override="bonus.Name"
            class="ma-2"
          />
        </v-col>
      </v-row>
    </div>

    <div v-if="bonus.IntegratedEquipment.length">
      <div class="text-overline ml-n2 mb-n2 text-subtle">
        CORE BONUS INTEGRATED EQUIPMENT
      </div>
      <v-row no-gutters justify="center">
        <v-col v-for="(x, i) in bonus.IntegratedEquipment" cols="auto">
          <cc-integrated-info :item="x" :panel="$vuetify.display.lgAndUp" />
        </v-col>
      </v-row>
    </div>

    <div v-if="bonus.SpecialEquipment.length">
      <div class="text-overline ml-n2 mb-n2 text-subtle">
        CORE BONUS ADDITIONAL EQUIPMENT
      </div>
      <v-row no-gutters justify="center">
        <v-col v-for="(x, i) in bonus.SpecialEquipment" cols="auto">
          <cc-integrated-info :item="x" :panel="$vuetify.display.lgAndUp" />
        </v-col>
      </v-row>
    </div>
  </cc-titled-panel>
</template>

<script lang="ts">
export default {
  name: 'cc-core-bonus-item',
  props: {
    bonus: {
      type: Object,
      required: true,
    },
  },
};
</script>
