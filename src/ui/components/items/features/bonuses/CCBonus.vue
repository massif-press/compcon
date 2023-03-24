<template>
  <component :is="panel ? 'bonusPanel' : 'bonusPopup'" :bonus="bonus" />
</template>

<script lang="ts">
import bonusPanel from './_bonusPanel.vue';
import bonusPopup from './_bonusPopup.vue';

export default {
  name: 'cc-bonus',
  components: { bonusPanel, bonusPopup },
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
  },
};
</script>
