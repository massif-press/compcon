<template>
  <sidebar-array-view title="EQUIPMENT TAGS" :array="tags" icon="mdi-tag" />
</template>

<script lang="ts">
import Vue from 'vue'
import SidebarArrayView from '../UI/SidebarArrayView.vue'

export default Vue.extend({
  name: 'tags',
  components: { SidebarArrayView },
  data: () => ({
    tags: [],
  }),
  created() {
    this.tags = this.$store.getters.getItemCollection('Tags').filter(x => !x.IsHidden)
  },
})
</script>
