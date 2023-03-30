<template>
  <sidebar-array-view title="EQUIPMENT TAGS" :array="tags" icon="mdi-tag" />
</template>

<script lang="ts">
import _ from 'lodash';
import SidebarArrayView from '../components/SidebarArrayView.vue';

import { CompendiumStore } from '@/stores';

export default {
  name: 'Tags',
  components: { SidebarArrayView },
  computed: {
    compendium(): CompendiumStore {
      return CompendiumStore();
    },
    tags(): string[] {
      return _.sortBy(
        this.compendium.Tags.filter((x) => !x.IsHidden),
        'Name'
      );
    },
  },
};
</script>
