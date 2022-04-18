<template>
  <gm-collection-view
    title="Factions"
    item-type="Faction"
    :items="factions"
    @add-new="$router.push('factions/edit/new')"
  />
</template>

<script lang="ts">
import Vue from 'vue'
import GmCollectionView from '../_views/GMCollectionView.vue'
export default Vue.extend({
  name: 'factions-roster',
  components: { GmCollectionView },
  computed: {
    factions() {
      return this.$store.getters['faction/getFactions']
    },
  },
})
</script>
