<template>
  <panel-base :encounter-instance="encounterInstance" :item="combatant" />
</template>

<script>
import PanelBase from './_PanelBase.vue';

export default {
  name: 'DeployablePanel',
  components: {
    PanelBase,
  },
  props: {
    combatant: {
      type: Object,
      required: true,
    },
    encounterInstance: {
      type: Object,
      required: true,
    },
  },
};
</script>
