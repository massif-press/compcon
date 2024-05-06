<template>
  <c-card-base
    :item="item"
    :small="small"
    :hover="hover"
    :equipped="equipped"
    :highlighted="highlighted"
    @equip="$emit('equip', $event)">
    <template #top>
      <v-row dense justify="space-around" class="mt-2">
        <v-col v-if="item.Armor" cols="auto">
          <v-tooltip text="Armor Bonus">
            <template #activator="{ props }">
              <v-icon v-bind="props" icon="mdi-shield-outline" />
            </template>
          </v-tooltip>
          <span class="stat-text">{{ item.ArmorString }}</span>
        </v-col>
        <v-col v-if="item.HPBonus" cols="auto">
          <v-tooltip text="HP Bonus">
            <template #activator="{ props }">
              <v-icon v-bind="props" icon="mdi-heart" />
            </template>
          </v-tooltip>
          <span class="stat-text">+{{ item.HpString }}</span>
        </v-col>
        <v-col v-if="item.EDefense" cols="auto">
          <v-tooltip text="Electronic Defense">
            <template #activator="{ props }">
              <v-icon v-bind="props" icon="cc:e_def" />
            </template>
          </v-tooltip>
          <span class="stat-text">{{ item.EdefString }}</span>
        </v-col>
        <v-col v-if="item.Evasion" cols="auto">
          <v-tooltip text="Evasion">
            <template #activator="{ props }">
              <v-icon v-bind="props" icon="cc:evasion" />
            </template>
          </v-tooltip>
          <span class="stat-text">{{ item.EvasionString }}</span>
        </v-col>
        <v-col v-if="item.Speed" cols="auto">
          <v-tooltip text="Speed">
            <template #activator="{ props }">
              <v-icon v-bind="props" icon="mdi-arrow-right-bold-hexagon-outline" />
            </template>
          </v-tooltip>
          <span class="stat-text">{{ item.SpeedString }}</span>
        </v-col>
      </v-row>
      <!-- <p
        v-if="item.Effect"
        class="card-effect pa-2 mb-1"
        style="font-size: 15px"
        v-html-safe="item.Effect"
      /> -->
      <p
        v-if="item.Description"
        v-html-safe="item.Description"
        class="card-effect pa-2 mb-1"
        style="font-size: 15px" />
      <p
        v-if="item.Detail"
        v-html-safe="item.Detail"
        class="card-effect pa-2 mb-1"
        style="font-size: 15px" />
      <div>
        <v-row
          v-if="item.Damage || item.Range"
          no-gutters
          justify="space-around"
          align="center"
          style="max-height: 200px; min-height: 50px">
          <v-col v-if="item.Damage" cols="auto">
            <cc-damage-element :damage="item.Damage" />
          </v-col>
          <v-col v-if="item.Range" cols="auto">
            <cc-range-element :range="item.Range" />
          </v-col>
        </v-row>
        <!-- <v-row no-gutters>
          <v-col v-if="item.Tags" cols="12" class="text-center pb-2">
            <cc-tags :tags="item.Tags" small density="compact" variant="outlined" color="accent" />
          </v-col>
        </v-row> -->
      </div>
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
    equipped: { type: Boolean },
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
