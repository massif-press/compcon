<template>
  <sidebar-array-view
    title="PILOT SKILL TRIGGERS"
    :array="skills"
    icon="cci-accuracy"
    nameKey="Trigger"
    descriptionKey="Detail"
  />
</template>

<script lang="ts">
import Vue from 'vue'
import SidebarArrayView from '../UI/SidebarArrayView.vue'

export default Vue.extend({
  name: 'skills',
  components: { SidebarArrayView },
  data: () => ({
    skills: [],
  }),
  created() {
    this.skills = this.$store.getters.getItemCollection('Skills')
  },
})
</script>
