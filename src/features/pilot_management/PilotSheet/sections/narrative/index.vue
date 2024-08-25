<template>
  <v-container>
    <skill-block :pilot="pilot" />
    <dt-resources-block :pilot="pilot" />
    <pilot-loadout-block :pilot="pilot" />
  </v-container>
</template>

<script lang="ts">
import SkillBlock from './components/SkillBlock.vue';
import DtResourcesBlock from './components/DtResourcesBlock.vue';
import PilotLoadoutBlock from './components/PilotLoadoutBlock.vue';

export default {
  name: 'narrative-view',
  components: { SkillBlock, DtResourcesBlock, PilotLoadoutBlock },
  props: {
    pilot: {
      type: Object,
      required: true,
    },
  },
};
</script>
