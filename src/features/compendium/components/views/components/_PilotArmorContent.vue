<template>
  <c-card-base :item="item" :small="small" :highlighted="highlighted" :hover="hover">
    <template #top>
      <v-row justify="space-around" align="center" class="text-text py-5">
        <v-col v-if="item.ArmorString" cols="auto">
          <cc-tooltip simple inline content="Armor Bonus">
            <v-icon icon="mdi-shield-outline" />
          </cc-tooltip>
          <span class="stat-text">{{ item.ArmorString }}</span>
        </v-col>
        <v-col v-if="item.HpString" cols="auto">
          <cc-tooltip simple inline content="HP Bonus">
            <v-icon icon="mdi-heart" />
          </cc-tooltip>
          <span class="stat-text">+{{ item.HpString }}</span>
        </v-col>
        <v-col v-if="item.EdefString" cols="auto">
          <cc-tooltip simple inline content="Electronic Defense">
            <v-icon icon="cc:e_def" />
          </cc-tooltip>
          <span class="stat-text">{{ item.EdefString }}</span>
        </v-col>
        <v-col v-if="item.EvasionString" cols="auto">
          <cc-tooltip simple inline content="Evasion">
            <v-icon icon="cc:evasion" />
          </cc-tooltip>
          <span class="stat-text">{{ item.EvasionString }}</span>
        </v-col>
        <v-col v-if="item.SpeedString" cols="auto">
          <cc-tooltip simple inline content="Speed">
            <v-icon icon="mdi-arrow-right-bold-hexagon-outline" />
          </cc-tooltip>
          <span class="stat-text">{{ item.SpeedString }}</span>
        </v-col>
      </v-row>
      <p
        v-if="item.Description"
        v-html-safe="item.Description"
        class="card-effect pa-2 mb-1 text-text"
        style="font-size: 15px"
      />
      <p
        v-if="item.Detail"
        v-html-safe="item.Detail"
        class="card-effect pa-2 mb-1 text-text"
        style="font-size: 15px"
      />
      <div></div>
    </template>
  </c-card-base>
</template>

<script lang="ts">
import CCardBase from './_cCardBase.vue';
export default {
  name: 'gear-card-content',
  components: { CCardBase },
  props: {
    item: { type: Object, required: true },
    small: { type: Boolean },
    hover: { type: Boolean },
    highlighted: { type: Boolean },
  },
};
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
