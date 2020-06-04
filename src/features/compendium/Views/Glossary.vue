<template>
  <sidebar-array-view
    title="GLOSSARY"
    :array="glossary"
    name-key="name"
    description-key="description"
  />
</template>

<script lang="ts">
import Vue from 'vue'
import SidebarArrayView from '../components/SidebarArrayView.vue'
import { glossary } from 'lancer-data'

export default Vue.extend({
  name: 'glossary',
  components: { SidebarArrayView },
  data: () => ({
    glossary: [],
  }),
  created() {
    this.glossary = this.$_.sortBy(glossary, [x => x.name])
  },
})
</script>
