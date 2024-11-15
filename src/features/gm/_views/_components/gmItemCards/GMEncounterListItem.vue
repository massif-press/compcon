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
            <cc-img :aspect-ratio="1" :src="item.PortraitController.Image" width="95" />
          </v-card>
        </v-col>
        <v-col>
          <v-row dense class="pl-1 pr-3">
            <v-col cols="auto" :class="`heading h3 ${isHovering ? 'text-accent' : ''}`">
              <div>
                <cc-remote-hover :item="item" color="accent" />
                <cc-missing-content-hover :item="item" />
                {{ item.Name }}
              </div>
            </v-col>
          </v-row>
          <sitrep-chip :sitrep="item.Sitrep" />
          <environment-chip :environment="item.Environment" />
          <div class="mt-1">
            <v-menu v-for="c in item.Combatants" open-on-hover open-delay="400" max-width="500px">
              <template #activator="{ props }">
                <v-chip v-bind="props" size="small" label class="mr-1">
                  <v-icon
                    :icon="c.npc.Icon"
                    start
                    size="x-large"
                    :color="c.side === 'enemy' ? 'error' : c.side === 'ally' ? 'success' : ''" />
                  {{ c.npc.Name }}
                </v-chip>
              </template>
              <v-card class="text-center">
                <v-card-text v-if="c.npc.NpcFeatureController">
                  <v-chip
                    v-for="f in c.npc.NpcFeatureController.Features"
                    :color="f.Color"
                    :prepend-icon="f.Icon"
                    size="small"
                    variant="elevated"
                    class="ma-1">
                    {{ f.Name }}
                  </v-chip>
                </v-card-text>
                <v-card-text v-if="c.npc.Layers">
                  <v-chip
                    v-for="l in c.npc.Layers"
                    size="small"
                    variant="elevated"
                    prepend-icon="mdi-layers"
                    color="primary"
                    class="ma-1">
                    {{ l.Layer.Name }}
                  </v-chip>
                </v-card-text>
              </v-card>
            </v-menu>
          </div>
        </v-col>
        <sort-chips :sorting="sorting" />
      </v-row>
    </template>
  </v-hover>
</template>

<script lang="ts">
import SortChips from './_subcomponents/sortChips.vue';
import MapPreview from '@/features/gm/encounters/_components/map/MapPreview.vue';
import SitrepChip from './_subcomponents/sitrepChip.vue';
import EnvironmentChip from './_subcomponents/envChip.vue';

export default {
  name: 'gm-location-list-item',
  components: { SortChips, MapPreview, SitrepChip, EnvironmentChip },
  props: {
    item: { type: Object, required: true },
    big: { type: Boolean },
    odd: { type: Boolean },
    grouping: { type: [Object, String], required: false, default: '' },
    sorting: { type: [Object, String], required: false, default: '' },
  },
  emits: ['open'],
};
</script>
