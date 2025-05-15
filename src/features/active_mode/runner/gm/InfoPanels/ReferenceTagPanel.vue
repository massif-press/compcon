<template>
  <v-card>
    <cc-title offset>Relevant Tags</cc-title>
    <cc-tags :tags="randomTags" extended />

    <cc-title offset class="mt-6">Other Tags</cc-title>
    <cc-tags :tags="allTags" extended />
  </v-card>
</template>

<script>
import _ from 'lodash';
import { CompendiumStore } from '@/stores';

export default {
  name: 'ReferenceTagPage',
  data: () => ({
    randomTags: [],
    allTags: [],
  }),
  mounted() {
    this.randomTags = _.sampleSize(CompendiumStore().Tags, 8);
    this.allTags = CompendiumStore().Tags.filter(
      (t) => !this.randomTags.some((x) => x.ID === t.ID)
    );
  },
};
</script>
