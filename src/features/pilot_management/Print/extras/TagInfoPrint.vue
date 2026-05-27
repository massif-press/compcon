<template>
  <tag-info-display :tags="tags" />
</template>

<script lang="ts">
import * as _ from 'lodash-es';
import TagInfoDisplay from '@/ui/components/print/TagInfoDisplay.vue';

export default {
  name: 'tag-info-print',
  components: { TagInfoDisplay },
  props: {
    pilot: {
      type: Object,
      required: true,
    },
    mech: {
      type: Object,
      required: false,
    },
  },
  computed: {
    tags() {
      let arr = [] as any[];
      if (this.pilot) arr = this.pilot.Loadout.Items.flatMap((x) => x.Tags);
      if (this.mech)
        arr = [
          ...arr,
          ...this.mech.MechLoadoutController.ActiveLoadout.Equipment.flatMap((x) => x.Tags),
        ];

      return _.uniqBy(arr, 'ID');
    },
  },
};
</script>
