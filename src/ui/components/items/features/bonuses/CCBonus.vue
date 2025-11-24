<template>
  <component
    :is="chip || icon ? 'bonusChip' : panel ? 'bonusPanel' : 'bonusPopup'"
    :bonus="bonus"
    :tier="tier"
    :icon="icon" />
</template>

<script lang="ts">
import bonusPanel from './_bonusPanel.vue';
import bonusPopup from './_bonusPopup.vue';
import bonusChip from './_bonusChip.vue';

export default {
  name: 'cc-bonus',
  components: { bonusPanel, bonusPopup, bonusChip },
  props: {
    bonus: {
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
    chip: {
      type: Boolean,
    },
    icon: {
      type: Boolean,
      default: false,
    },
    tier: {
      type: Number,
      required: false,
    },
  },
};
</script>
