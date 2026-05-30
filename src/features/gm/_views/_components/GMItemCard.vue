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

<script setup lang="ts">
import { computed } from 'vue'
import * as CardItems from './gmItemCards';
import { IStatContainer } from '@/classes/components/combat/stats/IStatContainer';

defineOptions({ name: 'gm-item-card' })

const props = withDefaults(defineProps<{
  item: object
  big?: boolean
  list?: boolean
  odd?: boolean
  grouping?: string
  sorting?: string
}>(), {
  odd: false,
  grouping: 'None',
  sorting: 'Name'
})

const emit = defineEmits<{
  'open': []
}>()

const type = computed(() => {
      return props.item.ItemType.charAt(0).toUpperCase() + props.item.ItemType.slice(1);
    })
const cardComponent = computed(() => {
      if (props.list) {
        return CardItems[`GM${type.value}ListItem`];
      }
      return CardItems[`GM${type.value}Card`];
    })
const groupValues = computed(() => {
      if (props.grouping === 'None') return '';

      //check stats
      if ((props.item as IStatContainer).StatController) {
        const stat = (props.item as IStatContainer).StatController.DisplayKeys.find(
          (x) => x.key === props.grouping || x.title === props.grouping
        );
        if (stat)
          return {
            title: stat.title,
            value: (props.item as IStatContainer).StatController.MaxStats[stat.key],
          };
      }

      // check labels
      if ((props.item as any).NarrativeController) {
        const label = (props.item as any).NarrativeController.Labels.find(
          (x) => x.title === props.grouping
        );
        if (label) return { title: label.title, value: label.value };
      }

      if (props.item[props.grouping])
        return { title: props.grouping, value: props.item[props.grouping] };

      return '';
    })
const sortValues = computed(() => {
      if (props.sorting === 'Name') return '';
      let out = '' as any;
      if (props.item[props.sorting]) out = { title: props.sorting, value: props.item[props.sorting] };
      if (props.item.StatController)
        out = { title: props.sorting, value: props.item.StatController.getMax(props.sorting) };
      if (props.item.NarrativeController)
        out = {
          title: props.sorting,
          value: props.item.NarrativeController.LabelDictionary[props.sorting],
        };
      return out;
    })
</script>
