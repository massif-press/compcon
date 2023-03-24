<template>
  <sidebar-array-view
    title="PILOT SKILL TRIGGERS"
    :array="skills"
    icon="cc:accuracy"
    name-key="Trigger"
    description-key="Detail"
  />
</template>

<script lang="ts">
import SidebarArrayView from '../components/SidebarArrayView.vue';

import { CompendiumStore } from '@/store';

export default {
  name: 'skills',
  components: { SidebarArrayView },
  data: () => ({
    skills: [],
  }),
  async created() {
    // const compendium =this.getModule(CompendiumStore);
    // this.skills = await compendium.Skills.filter((x) => x);
  },
};
</script>
