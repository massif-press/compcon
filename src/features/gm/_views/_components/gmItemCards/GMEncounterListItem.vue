<template>
  <v-hover>
    <template #default="{ isHovering, props }">
      <v-row
        v-bind="props"
        dense
        style="transition: border 0.2s ease"
        :style="`position: relative; cursor: pointer; border-radius: 2px; border:
        ${
          isSelected
            ? '1px solid rgb(var(--v-theme-success))'
            : isHovering
              ? '1px solid rgb(var(--v-theme-accent))'
              : '1px solid transparent'
        }; background-color: ${odd ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05'}`"
        @click="$emit('open', item)">
        <v-col cols="auto">
          <v-card variant="tonal" class="rounded-0">
            <cc-img :aspect-ratio="1" :src="item.PortraitController.Image" width="95" />
          </v-card>
        </v-col>
        <v-col>
          <v-row dense class="pl-1 pr-3" align="center">
            <v-col cols="auto" :class="`heading h3 ${isHovering ? 'text-accent' : ''}`">
              <div>
                <cc-remote-hover :item="item" color="accent" />
                <cc-missing-content-hover :item="item" />
                {{ item.Name }}
                <sitrep-chip :sitrep="item.Sitrep" />
                <environment-chip :environment="item.Environment" />
              </div>
            </v-col>
            <v-col cols="auto" class="ml-auto">
              <cc-split-chip
                v-for="label in item.NarrativeController.Labels"
                :label="label"
                class="mx-1" />
            </v-col>
          </v-row>
          <div class="mt-1">
            <combatant-chip
              v-for="c in item.Combatants.filter((x) => !x.reinforcement)"
              :item="c" />
            <v-tooltip v-if="item.Combatants.filter((x) => x.reinforcement).length" location="top">
              <template #activator="{ props }">
                <span v-bind="props">
                  <v-icon icon="mdi-alpha-r-circle-outline" class="ml-4" />
                  <v-icon icon="mdi-menu-right-outline" class="ml-n2" />
                </span>
              </template>
              Reinforcements
            </v-tooltip>
            <combatant-chip v-for="c in item.Combatants.filter((x) => x.reinforcement)" :item="c" />
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
import CombatantChip from './_subcomponents/combatantChip.vue';

export default {
  name: 'gm-location-list-item',
  components: { SortChips, MapPreview, SitrepChip, EnvironmentChip, CombatantChip },
  props: {
    item: { type: Object, required: true },
    big: { type: Boolean },
    odd: { type: Boolean },
    grouping: { type: [Object, String], required: false, default: '' },
    sorting: { type: [Object, String], required: false, default: '' },
    isSelected: { type: Boolean, default: false },
  },
  emits: ['open'],
};
</script>
