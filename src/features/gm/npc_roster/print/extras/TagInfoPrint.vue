<template>
  <tag-info-display :tags="tags" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Eidolon } from '@/classes/npc/eidolon/Eidolon';
import { NpcFeature } from '@/classes/npc/feature/NpcFeature';
import { Unit } from '@/classes/npc/unit/Unit';
import * as _ from 'lodash-es';
import TagInfoDisplay from '@/ui/components/print/TagInfoDisplay.vue';

defineOptions({ name: 'tag-info-print' })

const props = defineProps<{
  npcs: any[]
}>()

const tags = computed(() => {
      let features = [] as NpcFeature[];
      props.npcs.forEach((npc: any) => {
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
    })
</script>
