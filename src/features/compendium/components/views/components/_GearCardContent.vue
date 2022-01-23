<template>
  <c-card-base :item="item" :small="small" :hover="hover">
    <div slot="top">
      <v-row
        v-if="item.ItemType.toLowerCase() === 'pilotarmor'"
        dense
        justify="space-around"
        class="mt-2"
      >
        <v-col v-if="item.Armor" cols="auto">
          <cc-tooltip simple inline content="Armor Bonus">
            <v-icon>mdi-shield-outline</v-icon>
          </cc-tooltip>
          <span class="stat-text">{{ item.Armor }}</span>
        </v-col>
        <v-col v-if="item.HPBonus" cols="auto">
          <cc-tooltip simple inline content="HP Bonus">
            <v-icon>mdi-heart</v-icon>
          </cc-tooltip>
          <span class="stat-text">+{{ item.HPBonus }}</span>
        </v-col>
        <v-col v-if="item.EDefense" cols="auto">
          <cc-tooltip simple inline content="Electronic Defense">
            <v-icon>cci-edef</v-icon>
          </cc-tooltip>
          <span class="stat-text">{{ item.EDefense }}</span>
        </v-col>
        <v-col v-if="item.Evasion" cols="auto">
          <cc-tooltip simple inline content="Evasion">
            <v-icon>cci-evasion</v-icon>
          </cc-tooltip>
          <span class="stat-text">{{ item.Evasion }}</span>
        </v-col>
        <v-col v-if="item.Speed" cols="auto">
          <cc-tooltip simple inline content="Speed">
            <v-icon>$vuetify.icons.move</v-icon>
          </cc-tooltip>
          <span class="stat-text">{{ item.Speed }}</span>
        </v-col>
      </v-row>
      <p
        v-if="item.Description"
        v-html-safe="item.Description"
        class="card-effect pa-2 mb-1"
        style="font-size: 15px"
      />
      <p
        v-if="item.Detail"
        v-html-safe="item.Detail"
        class="card-effect pa-2 mb-1"
        style="font-size: 15px"
      />
      <div>
        <v-row
          v-if="item.Damage || item.Range"
          no-gutters
          justify="space-around"
          align="center"
          style="max-height: 200px; min-height: 50px"
        >
          <v-col v-if="item.Damage" cols="auto">
            <cc-damage-element :damage="item.Damage" />
          </v-col>
          <v-col v-if="item.Range" cols="auto">
            <cc-range-element :range="item.Range" />
          </v-col>
        </v-row>
        <!-- <v-row no-gutters>
          <v-col v-if="item.Tags" cols="12" class="text-center pb-2">
            <cc-tags :tags="item.Tags" small dense outlined color="accent" />
          </v-col>
        </v-row> -->
      </div>
    </div>
  </c-card-base>
</template>

<script lang="ts">
import Vue from 'vue'
import CCardBase from './_cCardBase.vue'
export default Vue.extend({
  name: 'gear-card-content',
  components: { CCardBase },
  props: {
    item: { type: Object, required: true },
    small: { type: Boolean },
    hover: { type: Boolean },
  },
})
</script>

<style scoped>
.card-effect {
  height: 75px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;

  -webkit-line-clamp: 3;
}
</style>
