<template>
  <tag-info-display :tags="tags" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import * as _ from 'lodash-es';
import TagInfoDisplay from '@/ui/components/print/TagInfoDisplay.vue';

defineOptions({ name: 'tag-info-print' })

const props = defineProps<{
  pilot: object
  mech?: object
}>()

const tags = computed(() => {
      let arr = [] as any[];
      if (props.pilot) arr = props.pilot.Loadout.Items.flatMap((x) => x.Tags);
      if (props.mech)
        arr = [
          ...arr,
          ...props.mech.MechLoadoutController.ActiveLoadout.Equipment.flatMap((x) => x.Tags),
        ];

      return _.uniqBy(arr, 'ID');
    })
</script>
