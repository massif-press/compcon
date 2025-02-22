<template>
  <div :class="mobile ? '' : 'pt-2 px-12'">
    <skill-block :pilot="pilot" />
    <dt-resources-block :pilot="pilot" />
    <pilot-loadout-block :pilot="pilot" />
  </div>
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
  computed: {
    mobile() {
      return this.$vuetify.display.mdAndDown;
    },
  },
};
</script>
