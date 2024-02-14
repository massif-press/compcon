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
            <span v-if="item.NpcClassController.Class"
              >&mdash; T{{ item.NpcClassController.Tier }}
              {{ item.NpcClassController.Class.Name }}</span
            >
            <span class="px-4">
              <v-chip
                v-for="t in item.NpcTemplateController.Templates"
                size="x-small"
                variant="flat"
                label
                color="primary"
                class="mr-3 mt-n1"
                ><v-icon icon="cc:npc_template" start />{{ t.Name }}</v-chip
              >
            </span>
          </div>
          <div class="text-caption pt-1">
            <stat-chips :stat-controller="item.StatController" />
          </div>
        </v-col>
        <v-col v-if="item.NpcClassController.Class" cols="auto"
          ><v-icon size="40" :icon="item.NpcClassController.Class.Icon" />
        </v-col>
        <sort-chips :grouping="grouping" :sorting="sorting" />
      </v-row>
    </template>
  </v-hover>
</template>

<script lang="ts">
import SortChips from './_subcomponents/sortChips.vue';
import StatChips from './_subcomponents/statChips.vue';

export default {
  name: 'gm-unit-list-item',
  components: { SortChips, StatChips },
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
