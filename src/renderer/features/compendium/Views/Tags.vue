<template>
  <sidebar-array-view title="EQUIPMENT TAGS" :array="tags" icon="mdi-tag" />
</template>

<script lang="ts">
import Vue from 'vue'
import SidebarArrayView from '../UI/SidebarArrayView.vue'
import { getModule } from 'vuex-module-decorators'
import { CompendiumStore } from '@/store'

export default Vue.extend({
  name: 'tags',
  components: { SidebarArrayView },
  data: () => ({
    tags: [],
  }),
  created() {
    const compendium = getModule(CompendiumStore, this.$store)
    this.tags = compendium.Tags.filter(x => !x.IsHidden)
  },
})
</script>
