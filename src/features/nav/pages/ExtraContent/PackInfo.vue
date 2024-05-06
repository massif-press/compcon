<template>
  <v-card>
    <v-toolbar color="primary" density="compact" class="px-3">
      <v-icon size="x-large" start>mdi-package</v-icon>
      <div class="heading h2" v-text="pack.manifest.name" />
      <div class="pl-2 mb-n2">by {{ pack.manifest.author }}</div>
      <v-spacer />
      <v-chip variant="outlined" dark label>{{ pack.manifest.version }}</v-chip>
    </v-toolbar>
    <pack-info-card :pack="pack" />
  </v-card>
</template>

<script lang="ts">
import PackInfoCard from './components/PackInfoCard.vue';
import { ContentPack } from '@/class';
import { IContentPack } from '@/classes/ContentPack';
import _ from 'lodash';
import { PropType } from 'vue';

export default {
  name: 'PackInfo',
  props: {
    pack: { type: Object as PropType<IContentPack>, required: true },
  },
  components: { PackInfoCard },
};
</script>
