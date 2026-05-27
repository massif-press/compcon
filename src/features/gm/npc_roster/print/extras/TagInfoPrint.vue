<template>
  <tag-info-display :tags="tags" />
</template>

<script lang="ts">
import { Eidolon } from '@/classes/npc/eidolon/Eidolon';
import { NpcFeature } from '@/classes/npc/feature/NpcFeature';
import { Unit } from '@/classes/npc/unit/Unit';
import * as _ from 'lodash-es';
import TagInfoDisplay from '@/ui/components/print/TagInfoDisplay.vue';

export default {
  name: 'tag-info-print',
  components: { TagInfoDisplay },
  props: {
    npcs: {
      type: Array,
      required: true,
    },
  },
  computed: {
    tags() {
      let features = [] as NpcFeature[];
      this.npcs.forEach((npc: any) => {
        if ((npc as Unit).NpcFeatureController)
          features = features.concat((npc as Unit).NpcFeatureController.Features);
        if ((npc as Eidolon).Layers) {
          (npc as Eidolon).Layers.forEach((layer) => {
            if (layer.Layer.Features.length) features = features.concat(layer.Layer.Features);
            if (layer.Layer.Shards && layer.Layer.Shards.Features.length)
              features = features.concat(layer.Layer.Shards.Features);
          });
        }
      });

      features = features.filter((x) => !x.IsHidden);

      return _.uniqBy(
        features.flatMap((f) => f.Tags),
        'ID'
      );
    },
  },
};
</script>
