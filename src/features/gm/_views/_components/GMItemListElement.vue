<template>
  <v-list-item
    border
    :class="selectedId === item.ID ? 'bg-primary' : ''"
    rounded
    style="margin-bottom: 2px"
    @click="$emit('open')">
    <template #prepend>
      <v-avatar>
        <v-icon
          v-if="item.NpcClassController?.HasClass"
          size="36"
          class="mt-n1"
          :icon="item.NpcClassController.Class.Icon" />
        <cc-img
          v-else-if="item.PortraitController.HasImage"
          :aspect-ratio="1"
          :src="item.PortraitController.Image" />
        <v-icon v-else size="36" class="mt-n1" :icon="item.Icon" />
      </v-avatar>
    </template>
    <template #title>
      <div class="heading">{{ item.Name }}</div>
      <div v-if="item.NpcClassController?.HasClass" class="text-caption text-uppercase mt-n1">
        T{{ item.NpcClassController.Tier }} {{ item.NpcClassController.Class.Name }}
      </div>
      <div v-if="item.NpcTemplateController" class="mt-n1">
        <v-chip
          v-for="t in item.NpcTemplateController.Templates"
          size="x-small"
          variant="flat"
          label
          color="primary"
          style="margin-right: 1px">
          {{ t.Name }}
        </v-chip>
      </div>
    </template>

    <template #append>
      <cc-missing-content-list v-if="missingContent" :controller="item.BrewController" />
      <cc-brew-info v-if="item.BrewController" :controller="item.BrewController" />
    </template>
  </v-list-item>
</template>

<script lang="ts">
import { IStatContainer } from '@/classes/components/combat/stats/IStatContainer';
import SortChips from './gmItemCards/_subcomponents/sortChips.vue';

export default {
  name: 'gm-item-list-element',
  components: { SortChips },
  props: {
    item: { type: Object, required: true },
    grouping: { type: String, required: false, default: 'None' },
    sorting: { type: String, required: false, default: 'Name' },
    selectedId: { type: String, required: false },
  },
  emits: ['open'],
  computed: {
    type() {
      return this.item.ItemType.charAt(0).toUpperCase() + this.item.ItemType.slice(1);
    },
    missingContent() {
      return this.item.BrewController?.IsUnableToLoad;
    },
    groupValues() {
      if (this.grouping === 'None') return '';

      //check stats
      if ((this.item as IStatContainer).StatController) {
        const stat = (this.item as IStatContainer).StatController.DisplayKeys.find(
          (x) => x.key === this.grouping || x.title === this.grouping
        );
        if (stat)
          return {
            title: stat.title,
            value: (this.item as IStatContainer).StatController.MaxStats[stat.key],
          };
      }

      // check labels
      if ((this.item as any).NarrativeController) {
        const label = (this.item as any).NarrativeController.Labels.find(
          (x) => x.title === this.grouping
        );
        if (label) return { title: label.title, value: label.value };
      }

      if (this.item[this.grouping])
        return { title: this.grouping, value: this.item[this.grouping] };

      return '';
    },
    sortValues() {
      if (this.sorting === 'Name') return '';
      let out = '' as any;
      if (this.item[this.sorting]) out = { title: this.sorting, value: this.item[this.sorting] };
      if (this.item.StatController)
        out = { title: this.sorting, value: this.item.StatController.getStat(this.sorting) };
      if (this.item.NarrativeController)
        out = {
          title: this.sorting,
          value: this.item.NarrativeController.LabelDictionary[this.sorting],
        };
      return out;
    },
  },
};
</script>
