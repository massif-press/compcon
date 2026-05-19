<template>
  <cc-panel class="mt-1 mb-2" :title="bonus.Name" icon="cc:corebonus" title-color="secondary">
    <div class="text-disabled" :class="mobile ? 'text-cc-overline' : 'flavor-text'">
      {{ bonus.MountedEffect }}
    </div>
  </cc-panel>
</template>

<script lang="ts">
import { useMobile } from '@/mixins/useMobile';
export default {
  mixins: [useMobile],
  name: 'cb-card',
  props: {
    bonus: {
      type: Object,
      required: true,
    },
  },
};
</script>
