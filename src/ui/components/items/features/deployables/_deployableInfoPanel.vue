<template>
  <cc-alert :title="deployable.Name" :icon="deployable.Icon">
    <div class="text-text">
      <deployable-info-base :deployable="deployable" :tier="tier" :owner="owner" />
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
    owner: {
      type: Object,
      required: false,
      default: null,
    },
  },
  computed: {
    activation() {
      return this.deployable.Activation ? this.deployable.Activation.toLowerCase() : 'Quick';
    },
  },
};
</script>
