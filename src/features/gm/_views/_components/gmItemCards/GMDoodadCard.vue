<template>
  <v-hover>
    <template #default="{ isHovering, props }">
      <v-card
        v-bind="props"
        :elevation="isHovering ? 12 : 0"
        :variant="isHovering ? 'outlined' : 'flat'"
        height="100%"
        style="position: relative"
        @click="$emit('open', item)">
        <cc-img :aspect-ratio="1" :src="item.PortraitController.Image" />
        <v-fade-transition>
          <v-card
            v-if="isHovering"
            style="position: absolute; bottom: 0; left: 0; right: 0"
            class="pa-2 text-center">
            <div class="heading">{{ item.Name }}</div>
            <div v-if="big">
              <v-divider />
              stats and/or description
            </div>
          </v-card>
        </v-fade-transition>
      </v-card>
    </template>
  </v-hover>
</template>

<script lang="ts">
export default {
  name: 'gm-doodad-card',
  props: {
    item: { type: Object, required: true },
    big: { type: Boolean },
    odd: { type: Boolean },
    grouping: { type: Object, required: false, default: '' },
  },
  emits: ['open'],
  data: () => ({
    hase: [
      { title: 'H', val: 'Hull' },
      { title: 'A', val: 'Agi' },
      { title: 'S', val: 'Sys' },
      { title: 'E', val: 'Eng' },
    ],
    stats: [
      { title: 'cc:structure', val: 'MaxStructure' },
      { title: 'mdi-shield', val: 'Armor' },
      { title: 'mdi-heart', val: 'MaxHP' },
      { title: 'cc:reactor', val: 'Stress' },
      { title: 'cc:heat', val: 'HeatCapacity' },
      { title: 'mdi-arrow-right-bold-hexagon-outline', val: 'Speed' },
      { title: 'cc:save', val: 'SaveTarget' },
      { title: 'cc:evasion', val: 'Evasion' },
      { title: 'cc:e_def', val: 'EDefense' },
      { title: 'cc:sensor', val: 'SensorRange' },
      { title: 'cc:activate', val: 'Activations' },
    ],
  }),
};
</script>
