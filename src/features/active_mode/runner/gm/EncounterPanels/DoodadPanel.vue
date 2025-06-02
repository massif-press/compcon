<template>
  {{ item }}
</template>

<script>
import PanelBase from './_PanelBase.vue';

export default {
  name: 'DoodadPanel',
  components: {
    PanelBase,
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
};
</script>
