<template>
  <simple-compendium-browser :items="skills" item-type="Skill" title="Pilot Skill Triggers" />
</template>

<script lang="ts">
import { Skill } from '@/class';
import SimpleCompendiumBrowser from '../../components/SimpleCompendiumBrowser.vue';

import { CompendiumStore } from '@/stores';

export default {
  name: 'skills',
  components: { SimpleCompendiumBrowser },
  computed: {
    skills(): Skill[] {
      return CompendiumStore().Skills;
    },
  },
};
</script>
