<template>
  <cc-alert :title="deployable.Name" :icon="deployable.Icon">
    <div class="text-text">
      <deployable-info-base :deployable="deployable" :tier="tier" />
    </div>
  </cc-alert>
</template>

<script lang="ts">
import deployableInfoBase from './_deployableInfoBase.vue';

export default {
  name: 'deployable-info-panel',
  components: { deployableInfoBase },
  props: {
    deployable: {
      type: Object,
      required: true,
    },
    tier: {
      type: Number,
      required: false,
    },
  },
  computed: {
    activation() {
      return this.deployable.Activation ? this.deployable.Activation.toLowerCase() : 'Quick';
    },
  },
};
</script>
