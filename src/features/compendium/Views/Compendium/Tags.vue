<template>
  <simple-compendium-browser :items="tags" item-type="Tag" title="Equipment Tags" />
</template>

<script lang="ts">
import _ from 'lodash';
import SimpleCompendiumBrowser from '../../components/SimpleCompendiumBrowser.vue';

import { CompendiumStore } from '@/stores';

export default {
  name: 'Tags',
  components: { SimpleCompendiumBrowser },
  computed: {
    tags() {
      return _.sortBy(
        CompendiumStore().Tags.filter((x) => !x.IsHidden),
        'Name'
      );
    },
  },
};
</script>
