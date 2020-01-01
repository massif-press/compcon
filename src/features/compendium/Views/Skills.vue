<template>
  <sidebar-array-view
    title="PILOT SKILL TRIGGERS"
    :array="skills"
    icon="cci-accuracy"
    name-key="Trigger"
    description-key="Detail"
  />
</template>

<script lang="ts">
import Vue from 'vue'
import SidebarArrayView from '../UI/SidebarArrayView.vue'
import { getModule } from 'vuex-module-decorators'
import { CompendiumStore } from '@/store'

export default Vue.extend({
  name: 'skills',
  components: { SidebarArrayView },
  data: () => ({
    skills: [],
  }),
  created() {
    const compendium = getModule(CompendiumStore, this.$store)
    this.skills = compendium.Skills
  },
})
</script>
