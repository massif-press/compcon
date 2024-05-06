<template>
  <c-card-base :item="item" :small="small" :highlighted="highlighted" :hover="hover">
    <template #top>
      <v-row justify="space-around" align="center" class="text-text py-5">
        <v-col v-if="item.ArmorString" cols="auto">
          <v-tooltip text="Armor Bonus">
            <template #activator="{ props }">
              <v-icon v-bind="props" icon="mdi-shield-outline" />
            </template>
          </v-tooltip>
          <span class="stat-text">{{ item.ArmorString }}</span>
        </v-col>
        <v-col v-if="item.HpString" cols="auto">
          <v-tooltip text="HP Bonus">
            <template #activator="{ props }">
              <v-icon v-bind="props" icon="mdi-heart" />
            </template>
          </v-tooltip>
          <span class="stat-text">+{{ item.HpString }}</span>
        </v-col>
        <v-col v-if="item.EdefString" cols="auto">
          <v-tooltip text="Electronic Defense">
            <template #activator="{ props }">
              <v-icon v-bind="props" icon="cc:e_def" />
            </template>
          </v-tooltip>
          <span class="stat-text">{{ item.EdefString }}</span>
        </v-col>
        <v-col v-if="item.EvasionString" cols="auto">
          <v-tooltip text="Evasion">
            <template #activator="{ props }">
              <v-icon v-bind="props" icon="cc:evasion" />
            </template>
          </v-tooltip>
          <span class="stat-text">{{ item.EvasionString }}</span>
        </v-col>
        <v-col v-if="item.SpeedString" cols="auto">
          <v-tooltip text="Speed">
            <template #activator="{ props }">
              <v-icon v-bind="props" icon="mdi-arrow-right-bold-hexagon-outline" />
            </template>
          </v-tooltip>
          <span class="stat-text">{{ item.SpeedString }}</span>
        </v-col>
      </v-row>
      <p
        v-if="item.Description"
        v-html-safe="item.Description"
        class="card-effect pa-2 mb-1 text-text"
        style="font-size: 15px" />
      <p
        v-if="item.Detail"
        v-html-safe="item.Detail"
        class="card-effect pa-2 mb-1 text-text"
        style="font-size: 15px" />
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
