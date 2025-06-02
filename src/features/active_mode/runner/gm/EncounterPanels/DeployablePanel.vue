<template>
  npc
  {{ item }}
</template>

<script>
import PanelBase from './_PanelBase.vue';

export default {
  name: 'DeployablePanel',
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
