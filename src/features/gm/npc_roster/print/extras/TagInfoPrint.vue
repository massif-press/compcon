<template>
  <div class="pa-2 mt-3">
    <div class="text-overline text-primary" style="line-height: 0">EQUIPMENT TAG DETAIL</div>
    <div v-for="t in tags" class="ma-2">
      <v-card variant="outlined" class="pa-2" color="grey">
        <v-row dense>
          <v-col cols="auto">
            <v-icon icon="mdi-tag-outline" />
          </v-col>
          <v-col>
            <div class="heading text-black">
              {{ t.Name }}
            </div>
            <div class="caption text-black">
              {{ t.Description }}
            </div>
          </v-col>
        </v-row>
      </v-card>
    </div>
  </div>
</template>

<script lang="ts">
import { Npc } from '@/classes/npc/Npc';
import { Eidolon } from '@/classes/npc/eidolon/Eidolon';
import { NpcFeature } from '@/classes/npc/feature/NpcFeature';
import { Unit } from '@/classes/npc/unit/Unit';
import _ from 'lodash';

export default {
  name: 'tag-info-print',
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
  methods: {
    showTag(id) {
      const hiddenTags = ['tg_hidden', 'tg_unique', 'tg_set_damage_type'];
      return !hiddenTags.includes(id);
    },
  },
};
</script>

<style scoped>
.caption {
  font-size: 12px;
}

.p-stat {
  font-size: 34px;
}

fieldset {
  padding: 0 4px;
  height: 100%;
  border-radius: 3px;
  border-color: rgb(var(--v-theme-grey-lighten2));
}
</style>
