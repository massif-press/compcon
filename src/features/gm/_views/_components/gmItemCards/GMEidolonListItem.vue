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
            {{ item.Name }}&mdash; T{{ item.Tier }} <cc-slashes /> CLASS {{ item.Class }}
          </div>
          <v-chip v-for="l in item.Layers" label prepend-icon="mdi-layers" class="mx-1 my-1">{{
            l.Layer.Name
          }}</v-chip>
        </v-col>

        <sort-chips :grouping="grouping" :sorting="sorting" />
      </v-row>
    </template>
  </v-hover>
</template>

<script lang="ts">
import SortChips from './_subcomponents/sortChips.vue';

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
};
</script>
