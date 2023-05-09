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
import { Skill } from '@/class';
import SidebarArrayView from '../../components/SidebarArrayView.vue';

import { CompendiumStore } from '@/stores';

export default {
  name: 'skills',
  components: { SidebarArrayView },
  computed: {
    skills(): Skill[] {
      return CompendiumStore().Skills;
    },
  },
};
</script>
