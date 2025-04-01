<template>
  <v-list-item
    border
    :class="`${selectedId === item.ID ? 'bg-primary' : ''} ${disabled ? 'disabled' : ''}`"
    style="margin-bottom: 2px"
    @click="disabled || missingContent ? '' : $emit('open')">
    <template #prepend>
      <v-avatar class="ml-n2 mr-1">
        <v-icon
          v-if="item.NpcClassController?.HasClass"
          size="36"
          :icon="item.NpcClassController.Class.Icon" />
        <cc-img
          v-else-if="item.PortraitController.HasImage"
          :aspect-ratio="1"
          :src="item.PortraitController.Image" />
        <v-icon v-else size="36" :icon="item.Icon" />
      </v-avatar>
    </template>
    <template #title>
      <span class="heading">{{ item.Name }}</span>
      <span v-if="item.NpcClassController?.HasClass" class="text-cc-overline">
        <cc-slashes class="pl-2" />
        T{{ item.NpcClassController.Tier }} {{ item.NpcClassController.Class.Name }}
      </span>
    </template>
    <template #subtitle>
      <div v-if="item.NpcTemplateController">
        <cc-chip v-for="t in item.NpcTemplateController.Templates" size="x-small">
          <v-icon icon="cc:npc_template" />
          {{ t.Name }}
        </cc-chip>
      </div>
    </template>

    <template #append>
      <cc-remote-hover :item="item" />
      <cc-missing-content-hover :item="item" />
      <cc-brew-info
        v-if="item.BrewController && !item.BrewController.IsUnableToLoad"
        :controller="item.BrewController" />
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
    disabled: { type: Boolean, required: false, default: false },
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

<style scoped>
.disabled {
  background: repeating-linear-gradient(
    45deg,
    rgba(182, 184, 191, 0.3),
    rgba(182, 184, 191, 0.3) 10px,
    rgba(142, 147, 165, 0.3) 10px,
    rgba(142, 147, 165, 0.3) 20px
  );
}
</style>
