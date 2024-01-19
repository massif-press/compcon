<template>
  <v-hover>
    <template #default="{ isHovering, props }">
      <v-row
        v-bind="props"
        dense
        :style="`position: relative; cursor: pointer; border-radius: 2px; border: ${
          isHovering ? '1px solid rgb(var(--v-theme-primary))' : ''
        }; background-color: ${odd ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05'}`"
        @click="$emit('open', item)">
        <v-col cols="auto">
          <v-card variant="tonal" class="rounded-0">
            <cc-img :aspect-ratio="1" :src="item.PortraitController.Image" width="75" />
          </v-card>
        </v-col>
        <v-col>
          <div :class="`heading h3 ${isHovering ? 'text-accent' : ''}`">
            {{ item.Name }}
          </div>
        </v-col>
        <sort-chips :grouping="grouping" :sorting="sorting" />
      </v-row>
    </template>
  </v-hover>
</template>

<script lang="ts">
import SortChips from './_subcomponents/SortChips.vue';

export default {
  name: 'gm-doodad-list-item',
  components: { SortChips },
  props: {
    item: { type: Object, required: true },
    big: { type: Boolean },
    odd: { type: Boolean },
    grouping: { type: [Object, String], required: false, default: '' },
    sorting: { type: [Object, String], required: false, default: '' },
  },
  emits: ['open'],
  data: () => ({
    hase: [
      { title: 'H', val: 'Hull' },
      { title: 'A', val: 'Agility' },
      { title: 'S', val: 'Systems' },
      { title: 'E', val: 'Engineering' },
    ],
    stats: [
      { title: 'cc:structure', val: 'Structure' },
      { title: 'mdi-shield', val: 'Armor' },
      { title: 'mdi-heart', val: 'HP' },
      { title: 'cc:reactor', val: 'Stress' },
      { title: 'cc:heat', val: 'Heatcap' },
      { title: 'mdi-arrow-right-bold-hexagon-outline', val: 'Speed' },
      { title: 'cc:save', val: 'Save' },
      { title: 'cc:evasion', val: 'Evasion' },
      { title: 'cc:e_def', val: 'EDefense' },
      { title: 'cc:sensor', val: 'Sensors' },
      { title: 'cc:activate', val: 'Activations' },
    ],
  }),
};
</script>
