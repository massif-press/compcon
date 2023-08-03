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
import SidebarArrayView from '../components/SidebarArrayView.vue'
import { getModule } from 'vuex-module-decorators'
import { CompendiumStore } from '@/store'

export default Vue.extend({
  name: 'skills',
  components: { SidebarArrayView },
  data: () => ({
    skills: [],
  }),
  async created() {
    const compendium = getModule(CompendiumStore, this.$store)
    console.log(compendium.Skills.filter(x => x.InLcp))
    this.skills = await compendium.Skills.filter(x => x)
  },
})
</script>
