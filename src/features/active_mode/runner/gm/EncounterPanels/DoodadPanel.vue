<template>
  <panel-base :encounter-instance="encounterInstance"
    :owner="combatant">
    <template #name-block>
      <div class="heading h2">{{ combatant.actor.Name }}</div>
      <div class="text-cc-overline">Doodad</div>
    </template>
  </panel-base>
</template>

<script>
import PanelBase from './_PanelBase.vue';

export default {
  name: 'DoodadPanel',
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
