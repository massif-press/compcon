<template>
  <component
    :is="cardComponent"
    :item="item"
    :big="big"
    :grouping="groupValues"
    :sorting="sortValues"
    :odd="odd"
    @open="$emit('open', $event)" />
</template>

<script lang="ts">
import * as CardItems from './gmItemCards';
import { IStatContainer } from '@/classes/components/combat/stats/IStatContainer';

export default {
  name: 'gm-item-card',
  props: {
    item: { type: Object, required: true },
    big: { type: Boolean },
    list: { type: Boolean },
    odd: { type: Boolean, default: false },
    grouping: { type: String, required: false, default: 'None' },
    sorting: { type: String, required: false, default: 'Name' },
  },
  emits: ['open'],
  computed: {
    type() {
      return this.item.ItemType.charAt(0).toUpperCase() + this.item.ItemType.slice(1);
    },
    cardComponent() {
      if (this.list) {
        return CardItems[`GM${this.type}ListItem`];
      }
      return CardItems[`GM${this.type}Card`];
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
        out = { title: this.sorting, value: this.item.StatController.getMax(this.sorting) };
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
