<template>
  <v-alert dense :color="color" border="left" outlined class="pb-0">
    <v-row no-gutters>
      <v-col cols="auto">
        <h3 class="heading" :style="`color: ${color}`">{{ trait.Name }}</h3>
      </v-col>
      <v-col v-if="trait.Use !== 'Mission'" cols="auto" class="ml-auto">
        <div class="subtle--text overline mt-n2">{{ trait.Use }}</div>
      </v-col>
    </v-row>
    <v-row dense align="center">
      <v-col>
        <div class="body-text text--text">{{ trait.Description }}</div>
      </v-col>
      <v-col md="auto" lg="12" :class="$vuetify.breakpoint.lgAndUp ? '' : 'ml-auto'">
        <cc-action
          v-for="(a, i) in trait.Actions"
          :key="`${trait.ID}_action_${i}`"
          :action="a"
          :panel="$vuetify.breakpoint.lgAndUp"
        />
        <!-- <cc-bonus
          v-for="(b, i) in trait.Bonuses"
          :key="`${trait.ID}_bonus_${i}`"
          :bonus="b"
          :panel="$vuetify.breakpoint.lgAndUp"
        /> -->
        <!-- <cc-synergy v-for="(s, i) in trait.Synergies" :key="`${trait.ID}_synergy_${i}`" :synergy="s" :panel="$vuetify.breakpoint.lgAndUp"/> -->
        <cc-deployable-info
          v-for="(d, i) in trait.Deployables"
          :key="`${trait.ID}_deployable_${i}`"
          :deployable="d"
          :panel="$vuetify.breakpoint.lgAndUp"
        />
        <cc-integrated-info
          v-for="(x, i) in trait.Integrated"
          :key="`${trait.ID}_integrated_${i}`"
          :item="x"
          :panel="$vuetify.breakpoint.lgAndUp"
        />
      </v-col>
    </v-row>
  </v-alert>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'cc-trait-item',
  props: {
    trait: {
      type: Object,
      required: true,
    },
    color: {
      type: String,
      required: false,
      default: 'primary',
    },
  },
})
</script>
