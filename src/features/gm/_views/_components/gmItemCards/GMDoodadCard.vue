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
              <stat-chips :stat-controller="item.StatController" />
            </div>
          </v-card>
        </v-fade-transition>
        <sort-chips :grouping="grouping" :sorting="sorting" />
      </v-card>
    </template>
  </v-hover>
</template>

<script lang="ts">
import StatChips from './_subcomponents/statChips.vue';
import SortChips from './_subcomponents/sortChips.vue';

export default {
  name: 'gm-doodad-card',
  components: { StatChips, SortChips },
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
