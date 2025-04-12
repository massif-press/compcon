<template>
  <div class="pa-2 mt-n3">
    <div class="text-overline text-primary">EQUIPMENT TAG DETAIL</div>
    <div
      v-for="t in tags"
      style="border: 1px solid grey; border-radius: 3px"
      class="px-2 mb-1 no-print-break">
      <div class="text-caption font-weight-bold text-uppercase mb-n1">
        {{ t.Name }}
      </div>
      <div class="caption text-black">
        {{ t.Description }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { CompendiumStore } from '@/stores';
import _ from 'lodash';

export default {
  name: 'tag-info-print',
  computed: {
    tags() {
      return _.sortBy(
        CompendiumStore().Tags.filter((x) => !x.IsHidden),
        (obj) => obj.Name
      );
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
