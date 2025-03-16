<template>
  <cc-panel>
    <template #toolbar>
      <v-toolbar v-if="mobile" flat color="primary" extended extension-height="20">
        <v-toolbar-title class="heading text-uppercase" style="font-size: calc(10px + 2.5vw)">
          {{ pack.manifest.name }}
        </v-toolbar-title>
        <template #extension>
          <div class="text-cc-overline pl-1">{{ pack.manifest.author }}</div>
          <v-spacer />
          <cc-chip size="x-small" color="secondary">v.{{ pack.manifest.version }}</cc-chip>
        </template>
      </v-toolbar>
      <cc-toolbar v-else icon="cc:content_manager" :title="pack.manifest.name" hide-close>
        <template #toolbar-items>
          <cc-chip
            title="VERSION"
            size="x-small"
            color="secondary"
            :label="pack.manifest.version"
            class="my-1" />
        </template>
        <template #subtitle>
          <div class="pl-2 mb-n2">by {{ pack.manifest.author }}</div>
        </template>
      </cc-toolbar>
    </template>

    <pack-info-card :pack="pack" />
  </cc-panel>
</template>

<script lang="ts">
import PackInfoCard from './components/PackInfoCard.vue';
import { IContentPack } from '@/classes/ContentPack';
import _ from 'lodash';
import { PropType } from 'vue';

export default {
  name: 'PackInfo',
  props: {
    pack: { type: Object as PropType<IContentPack>, required: true },
  },
  components: { PackInfoCard },
  computed: {
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
  },
};
</script>
