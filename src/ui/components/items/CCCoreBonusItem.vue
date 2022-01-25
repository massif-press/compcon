<template>
  <cc-titled-panel :title="bonus.Name" dense>
    <p
      v-if="bonus.InLcp"
      v-html-safe="bonus.LcpName"
      class="stat--text heading h3"
    />
    <p
      v-show="$vuetify.breakpoint.mdAndUp"
      v-html-safe="bonus.Description"
      class="flavor-text pb-0 mb-2 mt-0"
    />
    <p
      v-if="$vuetify.breakpoint.mdAndUp"
      v-html-safe="bonus.Effect"
      class="effect-text pa-2 mx-2 mb-2 light-panel clipped"
    />
    <div v-else v-html-safe="bonus.Effect" class="body-text mt-n1 pb-1" />
    <div v-if="bonus.Actions.length">
      <div class="overline ml-n2 mb-n2 subtle--text">CORE BONUS ACTIONS</div>
      <v-row no-gutters justify="center">
        <v-col v-for="(a, i) in bonus.Actions" :key="`${bonus.Name}_action_${i}`" cols="auto">
          <cc-action :action="a" :panel="$vuetify.breakpoint.lgAndUp" class="ma-2" />
        </v-col>
      </v-row>
    </div>

    <div v-if="bonus.Deployables.length">
      <div class="overline ml-n2 mb-n2 subtle--text">CORE BONUS DEPLOYABLES</div>
      <v-row no-gutters justify="center">
        <v-col
          v-for="(d, i) in bonus.Deployables"
          :key="`${bonus.Name}_deployable_${i}`"
          cols="auto"
        >
          <cc-deployable-info
            :deployable="d"
            :panel="$vuetify.breakpoint.lgAndUp"
            :name-override="bonus.Name"
            class="ma-2"
          />
        </v-col>
      </v-row>
    </div>

    <div v-if="bonus.IntegratedEquipment.length">
      <div class="overline ml-n2 mb-n2 subtle--text">CORE BONUS INTEGRATED EQUIPMENT</div>
      <v-row no-gutters justify="center">
        <v-col
          v-for="(x, i) in bonus.IntegratedEquipment"
          :key="`${bonus.Name}_integrated_${i}`"
          cols="auto"
        >
          <cc-integrated-info :item="x" :panel="$vuetify.breakpoint.lgAndUp" />
        </v-col>
      </v-row>
    </div>

    <div v-if="bonus.SpecialEquipment.length">
      <div class="overline ml-n2 mb-n2 subtle--text">CORE BONUS ADDITIONAL EQUIPMENT</div>
      <v-row no-gutters justify="center">
        <v-col
          v-for="(x, i) in bonus.SpecialEquipment"
          :key="`${bonus.Name}_special_${i}`"
          cols="auto"
        >
          <cc-integrated-info :item="x" :panel="$vuetify.breakpoint.lgAndUp" />
        </v-col>
      </v-row>
    </div>
  </cc-titled-panel>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'cc-core-bonus-item',
  props: {
    bonus: {
      type: Object,
      required: true,
    },
  },
})
</script>
