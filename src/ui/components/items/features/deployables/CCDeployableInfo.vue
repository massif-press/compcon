<template>
  <component
    :is="hover ? 'deployableInfoHover' : panel ? 'deployableInfoPanel' : 'deployableInfoPopup'"
    :deployable="deployable"
    :tier="tier" />
</template>

<script lang="ts">
import deployableInfoHover from './_deployableInfoHover.vue';
import deployableInfoPanel from './_deployableInfoPanel.vue';
import deployableInfoPopup from './_deployableInfoPopup.vue';

export default {
  name: 'cc-deployable-info',
  components: { deployableInfoHover, deployableInfoPanel, deployableInfoPopup },
  props: {
    deployable: {
      type: Object,
      required: true,
    },
    popup: {
      type: Boolean,
      default: true,
    },
    panel: {
      type: Boolean,
    },
    hover: {
      type: Boolean,
    },
    tier: {
      type: Number,
      required: false,
    },
  },
};
</script>
