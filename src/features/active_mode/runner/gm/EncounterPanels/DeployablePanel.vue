<template>
  <panel-base :encounter="encounter" :item="combatant" />
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
    encounter: {
      type: Object,
      required: true,
    },
  },
};
</script>
