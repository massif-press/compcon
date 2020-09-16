<template>
  <v-row dense align="center">
    <v-col v-if="$vuetify.breakpoint.mdAndUp" cols="auto" class="text-center">
      <v-icon
        :class="{ 'mr-4': small }"
        :size="small ? 40 : 80"
        :color="lock ? 'light-panel' : color"
        v-html="`cci-rank-${rank}`"
      />
    </v-col>
    <v-col>
      <p class="body-text px-3 ma-0 ml-n2" v-html="talentRank.Description" />
      <div v-if="talentRank.Actions.length">
        <div class="overline ml-n2 mb-n1 ml-4 subtle--text">TALENT ACTIONS</div>
        <v-row no-gutters justify="center">
          <v-col
            v-for="(a, i) in talentRank.Actions"
            :key="`${talentRank.Name}_action_${i}`"
            cols="auto"
          >
            <cc-action :action="a" :panel="$vuetify.breakpoint.lgAndUp" class="ma-2" />
          </v-col>
        </v-row>
      </div>

      <div v-if="talentRank.Deployables.length">
        <div class="overline ml-n2 mb-n1 ml-4 subtle--text">TALENT DEPLOYABLES</div>
        <v-row no-gutters justify="center">
          <v-col
            v-for="(d, i) in talentRank.Deployables"
            :key="`${talentRank.Name}_deployable_${i}`"
            cols="auto"
          >
            <cc-deployable-info
              :deployable="d"
              :panel="false"
              :name-override="talentRank.Name"
              class="ma-2"
            />
          </v-col>
        </v-row>
      </div>

      <div v-if="talentRank.IntegratedEquipment.length">
        <div class="overline ml-n2 mb-n1 ml-4 subtle--text">TALENT EQUIPMENT</div>
        <v-row no-gutters justify="center">
          <v-col
            v-for="(x, i) in talentRank.IntegratedEquipment"
            :key="`${talentRank.Name}_integrated_${i}`"
            cols="auto"
          >
            <cc-integrated-info :item="x" :panel="false" />
          </v-col>
        </v-row>
      </div>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'cc-talent-rank-item',
  props: {
    rank: {
      type: Number,
      required: true,
    },
    talentRank: {
      type: Object,
      required: true,
    },
    lock: {
      type: Boolean,
      required: false,
    },
    small: {
      type: Boolean,
      required: false,
    },
    color: {
      type: String,
      required: false,
      default: 'accent',
    },
  },
})
</script>
